const app = require('express').Router();

app.get('/', async (req, res) => {
    res.render('portal.ejs');
});

app.use('/auth', require('./OAuth_Authentication/LoginOAuth'));
module.exports = app;