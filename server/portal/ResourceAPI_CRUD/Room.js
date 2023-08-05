const Hotel = require('../../model/Hotel');
const AddOn = require('../../model/AddOn');
const Room = require('../../model/Room');
const app = require('express').Router();
const FileHandler = require('../../gridFsFiles/File');
const checkFileSize = require('../../gridFsFiles/CheckFileSize');
const BookedGuest = require('../../model/BookedGuest');

/**
 * BASE URL
 * /api/room/...
 */

/**
 * Post the resources into database
 * @param - Hotel Object Id
 */
app.post('/hotel/:id', async (req, res) => {
    /**
     * Ignored payload object
     */
    const ignored = [];
    try {
        const hotel = await Hotel.findOne(req.params.id);
        if (!hotel)
            return res.status(404).json({
                message: 'Hotel not found'
            });

        var payload = req.body;

        /**
         * Schema keys that has to be exactly same as payload's object keys
         */
        const required = ['type', 'bedSize', 'floor', 'view', 'price'];
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
            return { type: c.type, hotel: hotel._id, bedSize: c.bedSize, floor: c.floor, view: c.view, price: c.price }
        });

        /**
         * Resolving all pending promises
         */
        payload = await Promise.all(payload);

        /**
         * Inserted documents
         */
        const newRooms = await Room.insertMany(payload, { ordered: false });

        for (var i = 0; i < newRooms.length; i++) {
            await Hotel.findByIdAndUpdate(req.params.id, {
                $addToSet: {
                    rooms: newRooms[i]._id
                }
            });
        }

        /**
         * Update the total rooms for the hotel and save it
         */
        hotel.calcTotalRooms();
        await hotel.save();

        /**
         * Finally, return the response body
         */
        return res.status(200).json({
            message: 'Inserted',
            detail: newRooms,
            ignored: ignored
        });
    } catch (err) {

        /**
         * Error handling
        */

        console.log(err.message);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
});

/**
 * Retrieve room
 * @param id - Room Object Id
 */
app.get('/:id', async (req, res) => {
    res.json(await Room.findById(req.params.id).populate({
        path: 'hotel',
        populate: {
            path: 'location.city',
            populate: {
                path: 'state',
                populate: {
                    path: 'country'
                }
            }
        }
    }).populate('addOns'));
});

/**
 * Delete a resource from database
 * @param id - Room Object Id
 */
app.delete('/:id', async (req, res) => {
    try {
        const deletedRoom = await Room.deleteOne({ _id: req.params.id });
        res.status(200).json({
            message: 'Deleted',
            detail: deletedRoom
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
 * Upload room file using the room's Object id
 * @param id - Hotel Object Id (to be changed later)
 * In next version, we'll use roomId(param) to directly upload and save picture's file id
 */
app.post('/file/:id', FileHandler.upload.single('room'), checkFileSize, async (req, res) => {
    try {

        /**
         * Add the file id to the room document and log the document after saving
         */
        const hotel = await Hotel.findById(req.params.id);
        for (const room of hotel.rooms)
            console.log(await Room.findByIdAndUpdate(room, {
                $set: {
                    picture: req.file.id
                },
            }, { upsert: true }))
        res.json(req.file);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'Server error'
        })
    }
});

/**
 * Retrieve room file using the file's Object Id
 * @param id - File Object Id
 */
app.get('/file/:id', async (req, res) => {
    FileHandler.retrieve(req, res);
});

module.exports = app;