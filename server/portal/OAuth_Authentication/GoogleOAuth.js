require('dotenv').config();
const passport = require("passport");
const Guest = require("../../model/Guest");
const G_OAuthStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser((guest, done) => {
    done(null, guest.id);
})

passport.deserializeUser(async (id, done) => {
    const guest = await Guest.findOne({ _id: id });
    if (guest)
        done(null, guest);
})

passport.use(new G_OAuthStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['profile', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const guest = await Guest.findOne({ guestId: profile.id });
            if (guest) {

                /**
                 * If a guest already exist, then execute callback with guest
                 */
                done(null, guest);
            } else {

                /**
                 * Create a new guest
                 */
                const guest = new Guest({
                    name: profile._json.name,
                    email: profile._json.email,
                    guestId: profile.id,
                    avatar: profile._json.picture,
                });
                const savedGuest = await guest.save();
                done(null, savedGuest);
            }
        } catch (err) {
            done(err, null);
        }
    }
))