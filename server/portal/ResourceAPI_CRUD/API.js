const app = require('express').Router();

app.use('/country', require('./Country'));
app.use('/state', require('./State'));
app.use('/city', require('./City'));

app.use('/hotel', require('./Hotel'));
app.use('/room', require('./Room'));
module.exports = app;