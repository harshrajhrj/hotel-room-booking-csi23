require('dotenv').config();
const passport = require("passport");
const Guest = require("../../model/Guest");
const G_OAuthStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new G_OAuthStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['profile', 'email']
}, {
    async function(accessToken, refreshToken, profile, done) {
        try {
            const guest = Guest.findOne({ guestId: profile.id });
            if (guest) {

                /**
                 * If a guest already exist, then execute callback with guest
                 */
                done(null, guest);
            } else {

                /**
                 * Create a new guest
                 */
                console.log(profile);
                done();
            }
        } catch (err) {
            done(err, null);
        }
    }
}))