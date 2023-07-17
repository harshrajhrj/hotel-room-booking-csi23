const ConnectDB = require('./ConnectDB');
ConnectDB();
const express = require('express');
const expressSession = require('express-session');
const flash = require('connect-flash');
const mongoSession = require('connect-mongo');
const path = require('path');
const passport = require('passport');
const app = express();

// middleware to keep the incoming objects in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creating a session middleware
app.use(expressSession({
    secret: 'hotel server session',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: 'hotel room booking',
    resave: false,

    // using MongoDB based session storage
    store: mongoSession.create({
        mongoUrl: process.env.DB_URL,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    })
}))

// flash middleware to store text messages in session
app.use(flash());

// type of flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// using passport session to store the user in session object
app.use(passport.initialize())
app.use(passport.session())

// view engine set to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware to server static files with express
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', require('./server/portal/portal'));

app.listen(3000, () => { console.log('HotelRoomSystem Server is live') });