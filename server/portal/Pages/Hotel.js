const Hotel = require("../../model/Hotel");
const app = require('express').Router();
const PageController = require('../pageController');
/**
 * BASE URL
 * /v1/hotel/...
 */

/**
 * Render specific hotel
 * @param id - Hotel Object Id
 */
app.get('/:id', async (req, res) => {
    try {
        const hotel = await fetch(`${process.env.SERVER_URL}/api/hotel/${req.params.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        await hotel.json();
        const Page = new PageController('Hotel', { 'room_card': true });
        res.render('portal.ejs', { Page, hotel });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

module.exports = app;