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
        const guest = req.user;
        let hotel = await fetch(`${process.env.PRODUCTION_URL}/api/hotel/${req.params.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
        hotel = await hotel.json();
        const Page = new PageController('Hotel', { 'room_card': true });
        res.render('portal.ejs', { Page, guest, hotel });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'An error occurred'
        })
    }
});

module.exports = app;