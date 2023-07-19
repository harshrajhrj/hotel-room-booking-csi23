const app = require('express').Router();

app.use('/country', require('./Country'));
app.use('/state', require('./State'));
app.use('/city', require('./City'));
module.exports = app;