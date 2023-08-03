const ConnectDB = require('./ConnectDB');
ConnectDB();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressSession = require('express-session');
const mongoSession = require('connect-mongo');
const path = require('path');
const passport = require('passport');
require('./server/portal/OAuth_Authentication/GoogleOAuth');
const flash = require('connect-flash');
const app = express();

// middleware to keep the incoming objects in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://localhost:3000", "https://harshrajapp.tech"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

// creating a session middleware
app.use(expressSession({
    secret: 'hotel server session',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: 'hotel-room-booking',
    resave: false,

    // using MongoDB based session storage
    store: mongoSession.create({
        mongoUrl: process.env.DB_URL,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    })
}))

// authenticate the session
app.use(passport.authenticate('session'));

// using passport session to store the guest in session object
app.use(passport.initialize())
app.use(passport.session())

// flash middleware to store text messages in session
app.use(flash());

// type of flash messages
app.use((req, res, next) => {
    if (req.user) {
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
    }
    next();
})

// view engine set to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Using Template Caching:
 * Instead of lazy loading, you can utilize EJS template caching to improve performance. 
 * EJS has built-in support for caching, which can reduce the overhead of reading and parsing templates for each request.
 */
// app.set('view cache', true);

// middleware to server static files with express
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', require('./server/portal/portal'));

app.listen(3000, () => { console.log('HotelRoomSystem Server is live') });