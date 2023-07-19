const City = require('../../model/City');
const State = require('../../model/State');
const app = require('express').Router();

/**
 * BASE URL
 * /api/city/...
 */

/**
 * Put the resources into database
 */
app.put('/', async (req, res) => {
    /**
     * Ignored payload object
     */
    const ignored = [];
    try {
        var payload = req.body;

        /**
         * Schema keys that has to be exactly same as payload's object keys
         */
        const required = ['city', 'iso', 'state', 'pincode'];
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
            var state = await State.findOne({ iso: c.state });
            return { city: c.city, iso: c.iso, stateISO: c.state, state: state._id, pincode: c.pincode }
        })

        /**
         * Resolving all pending promises
         */
        payload = await Promise.all(payload);

        /**
         * Inserted documents
         */
        const newCities = await City.insertMany(payload, { ordered: false });

        /**
         * Finally, return the response body
         */
        return res.status(200).json({
            message: 'Inserted',
            detail: newCities,
            ignored: ignored
        })
    } catch (err) {

        /**
         * Error handling
         */
        if (err.code === 11000) {
            const detail = err.writeErrors.map(e => e.err.op.city + ' already exists!');
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
})

/**
 * Delete a resource from database
 */
app.delete('/:stateISO/:iso', async (req, res) => {
    try {
        const deletedCity = await City.deleteOne({ iso: req.params.iso.toUpperCase(), stateISO: req.params.stateISO.toUpperCase() });
        res.status(200).json({
            message: 'Deleted',
            detail: deletedCity
        })
    } catch (err) {
        /**
         * Error handling
         */
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})

module.exports = app;