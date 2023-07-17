const app = require('express').Router();

app.get('/', async (req, res) => {
    const guest = req.user;
    res.render('portal.ejs', { guest });
});

app.use('/auth', require('./OAuth_Authentication/LoginOAuth'));
module.exports = app;