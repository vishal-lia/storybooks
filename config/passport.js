const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
                proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleID: profile.id })
                .then(user => {
                    if(user) {
                        // Return User
                        done(null, user);
                    } else {
                        // Create User
                        let newUser = new User({
                            googleID: profile.id,
                            email: profile.emails[0].value,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            image: profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'))
                        });

                        newUser.save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        }
    ));

    // Sessions

    // saves the user id in the request object as request.session.passport
    // adds the user object to the request object as request.user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // called by req.isAuthenticated()
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => console.log(err));
    });
}
