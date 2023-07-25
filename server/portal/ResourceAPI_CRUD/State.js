const Country = require('../../model/Country');
const State = require('../../model/State');
const app = require('express').Router();

/**
 * BASE URL
 * /api/state/...
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
        const required = ['state', 'iso', 'country', 'capital'];
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
            var country = await Country.findOne({ iso3: c.country });
            return { state: c.state, iso: c.iso, countryISO: c.country, country: country._id, capital: c.capital }
        })

        /**
         * Resolving all pending promises
         */
        payload = await Promise.all(payload);

        /**
         * Inserted documents
         */
        const newStates = await State.insertMany(payload, { ordered: false });

        /**
         * Finally, return the response body
         */
        return res.status(200).json({
            message: 'Inserted',
            detail: newStates,
            ignored: ignored
        })
    } catch (err) {

        /**
         * Error handling
         */
        if (err.code === 11000) {
            const detail = err.writeErrors.map(e => e.err.op.state + ' already exists!');
            return res.status(400).json({
                message: 'Unique value error',
                detail: detail,
                ignored: ignored
            })
        } else {
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
})

/**
 * Delete a resource from database
 */
app.delete('/:countryISO/:iso', async (req, res) => {
    try {
        const deletedState = await State.deleteOne({ iso: req.params.iso.toUpperCase(), countryISO: req.params.countryISO.toUpperCase() });
        res.status(200).json({
            message: 'Deleted',
            detail: deletedState
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