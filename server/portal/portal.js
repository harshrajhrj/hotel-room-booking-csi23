const Hotel = require('../model/Hotel');
const PageController = require('./pageController');
const app = require('express').Router();

app.get('/', async (req, res) => {
    const guest = req.user;
    const Page = new PageController('Home', true);
    const hotel = await fetch(`${process.env.SERVER_URL}/api/hotel`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    const hotels = await hotel.json();
    res.render('portal.ejs', { Page, guest, hotels });
});

app.use('/auth', require('./OAuth_Authentication/LoginOAuth'));
app.use('/api', require('./ResourceAPI_CRUD/API'));
app.use('/v1', require('./Pages/Page'));

module.exports = app;