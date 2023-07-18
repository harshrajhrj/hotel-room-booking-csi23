const Country = require('../../model/Country');
const State = require('../../model/State');
const app = require('express').Router();

/**
 * BASE URL
 * /api/state/...
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
        const required = ['state', 'countryCode', 'capital'];
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
            var country = await Country.findOne({ code: c.countryCode });
            return { state: c.state, countryCode: country._id, capital: c.capital }
        })

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
app.delete('/:capital', async (req, res) => {
    try {
        const deletedState = await State.deleteOne({ capital: req.params.capital.toUpperCase() });
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