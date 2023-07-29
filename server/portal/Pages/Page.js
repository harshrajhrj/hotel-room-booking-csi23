const app = require('express').Router();

app.use('/hotel', require('./Hotel'));
app.use('/room', require('./Room'));

module.exports = app;