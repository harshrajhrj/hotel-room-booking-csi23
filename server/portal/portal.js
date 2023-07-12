const app = require('express').Router();

app.get('/', async (req, res) => {
    res.render('portal.ejs');
});

module.exports = app;