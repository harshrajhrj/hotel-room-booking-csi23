const passport = require('passport');
const app = require('express').Router();
require('dotenv').config();

app.get('/login', passport.authenticate('google'));
app.get('/redirect/google', passport.authenticate('google', {
    failureRedirect: '/auth/forbidden',
    successRedirect: '/'
}));

app.get('/forbidden', async (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log in failed!'
    })
})

app.post('/logout', async (req, res) => {
    if (req.user) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        })
    } else
        res.redirect('/');
})
module.exports = app;