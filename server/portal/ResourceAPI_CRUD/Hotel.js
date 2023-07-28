const City = require('../../model/City');
const Hotel = require('../../model/Hotel');
const app = require('express').Router();
const FileHandler = require('../../gridFsFiles/File');

/**
 * BASE URL
 * /api/hotel/...
 */

/**
 * Post the resources into database
 */
app.post('/', async (req, res) => {
    /**
     * Ignored payload object
     */
    const ignored = [];
    try {
        var payload = req.body;

        /**
         * Schema keys that has to be exactly same as payload's object keys
         */
        const required = ['hotel', 'location', 'rating'];
        payload = await payload.filter(function (p) {
            var flag = true;
            for (const ele of required)
                if (!p[ele]) {
                    flag = false;
                    break;
                }
            /**
             * If not found or not same, then push the object in ignored[Array]
             */
            if (!flag)
                ignored.push(p);

            /**
             * Return true element
             */
            return flag;
        }).map(async (c) => {
            var city = await City.findOne({ city: c.location.city.toUpperCase() });
            return { hotel: c.hotel, location: { city: city._id, street: c.location.street }, rating: c.rating }
        });

        /**
         * Resolving all pending promises
         */
        payload = await Promise.all(payload);

        /**
         * Inserted documents
         */
        const newHotels = await Hotel.insertMany(payload, { ordered: false });

        /**
         * Finally, return the response body
         */
        return res.status(200).json({
            message: 'Inserted',
            detail: newHotels,
            ignored: ignored
        })
    } catch (err) {

        /**
         * Error handling
         */
        if (err.code === 11000) {
            const detail = err.writeErrors.map(e => e.err.op.hotel + ' already exists!');
            return res.status(400).json({
                message: 'Unique value error',
                detail: detail,
                ignored: ignored
            })
        } else {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
});

/**
 * Retrieve hotel
 */
app.get('/:id', async (req, res) => {
    res.json(await Hotel.findOne({ _id: req.params.id }));
})

/**
 * Delete a resource from database
 */
app.delete('/:id', async (req, res) => {
    try {
        const deletedHotel = await Hotel.deleteOne({ _id: req.params.id });
        res.status(200).json({
            message: 'Deleted',
            detail: deletedHotel
        })
    } catch (err) {
        /**
         * Error handling
         */
        res.status(500).json({
            message: 'Internal server error'
        })
    }
});

/**
 * @var fileSizeLimit restricts file greater than 1 MB
 */
const fileSizeLimit = 1 * 1024 * 1024; //1 MB

/**
 * Middleware to check the permitted files to be considered(i.e. the file size within range)
 * and rejects the file having file size out of range.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Callback
 */
const checkFileSize = (req, res, next) => {

    /**
     * Middleware req body variables for carrying the file status
     */
    req.body["uploaded"] = [];
    req.body["discarded"] = [];
    req.body["missing"] = [];

    /**
     * Checks if file exist or not
     */
    if (!req.files) {
        return res.status(400).json({ error: 'File size limit exceeded or no file uploaded.' });
    }

    /**
     * If file exists, then size checking for thumbnail file
     */
    if (req.files['thumbnail'])
        if (req.files['thumbnail'][0].size > fileSizeLimit) {
            FileHandler.delete(req.files['thumbnail'][0].id);
            req.body.discarded.push(['thumbnail', req.files['thumbnail'][0].originalname]);
        } else {
            req.body.uploaded.push(['thumbnail', req.files['thumbnail'][0].originalname, req.files['thumbnail'][0].id]);
        }
    /**
     * If thumbnail missing
     */
    else
        req.body.missing.push(['thumbnail', 'missing']);

    /**
     * If file exists, then size checking for thumbnail file
     */
    if (req.files['pictures']) {
        for (var i = 0; i < req.files['pictures'].length; i++) {
            if (req.files['pictures'][i].size > fileSizeLimit) {
                FileHandler.delete(req.files['pictures'][i].id);
                req.body.discarded.push(['pictures', req.files['pictures'][i].originalname]);
            } else {
                req.body.uploaded.push(['pictures', req.files['pictures'][i].originalname, req.files['pictures'][i].id]);
            }
        }
    }
    next();
};

/**
 * Upload hotel files using the hotel's Object id
 */
app.post('/file/:id', FileHandler.upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'pictures' }]), checkFileSize, async (req, res) => {
    let thumbnail = null;
    let pictures = [];

    /**
     * Arrange the files(to be uploaded) to thumnail(var) and pictures(var) according to the file type.
     */
    for (const file of req.body.uploaded) {
        if (file[0] === 'thumbnail') {
            thumbnail = file[2];
        } else if (file[0] === 'pictures') {
            pictures.push(file[2]);
        }
    }

    /**
     * Add the file id to the hotel document and log the document after saving
     */
    console.log(await Hotel.findByIdAndUpdate(req.params.id, {
        $set: {
            thumbnail: thumbnail
        },
        $push: {
            pictures: {
                $each: pictures
            }
        }
    }, { upsert: true }))
    res.json(req.body);
});

module.exports = app;