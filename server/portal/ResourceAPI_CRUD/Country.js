const Country = require("../../model/Country");
const app = require('express').Router();

/**
 * BASE URL
 * /api/country/...
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
        const required = ['country', 'dialCode', 'iso3', 'capital', 'timezone'];
        payload = payload.filter(function (p) {
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
        })

        /**
         * Inserted documents
         */
        const newCountries = await Country.insertMany(payload, { ordered: false });

        /**
         * Finally, return the response body
         */
        return res.status(200).json({
            message: 'Inserted',
            detail: newCountries,
            ignored: ignored
        })
    } catch (err) {

        /**
         * Error handling
         */
        if (err.code === 11000) {
            const detail = err.writeErrors.map(e => e.err.op.country + ' already exists!');
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
app.delete('/:iso3', async (req, res) => {
    try {
        const deletedCountry = await Country.deleteOne({ iso3: req.params.iso3 });
        res.status(200).json({
            message: 'Deleted',
            detail: deletedCountry
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