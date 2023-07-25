const City = require('../../model/City');
const Hotel = require('../../model/Hotel');
const app = require('express').Router();

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

module.exports = app;