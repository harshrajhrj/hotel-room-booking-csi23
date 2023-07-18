const app = require('express').Router();

app.use('/country', require('./Country'));
app.use('/state', require('./State'));
module.exports = app;