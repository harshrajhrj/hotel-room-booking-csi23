const PageController = require('./pageController');
const app = require('express').Router();

app.get('/', async (req, res) => {
    const guest = req.user;
    const Page = new PageController('Home', true);
    res.render('portal.ejs', { Page, guest });
});

app.use('/auth', require('./OAuth_Authentication/LoginOAuth'));
app.use('/api', require('./ResourceAPI_CRUD/API'));
module.exports = app;