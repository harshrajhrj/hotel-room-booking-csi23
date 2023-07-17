const passport = require('passport');
const app = require('express').Router();
require('dotenv').config();

app.get('/', passport.authenticate('google'));
app.get('/redirect/google', passport.authenticate('google', {
    failureRedirect : '/forbidden',
    successRedirect : '/'
}));

app.get('/forbidden', async (req, res) => {
    res.status(401).json({
        error : true,
        message : 'Log in failed!'
    })
})
module.exports = app;