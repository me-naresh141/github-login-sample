let passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
let User = require("../model/user");
// console.log(process.env.CLIENT_ID);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);
      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        // console.log(err, user);
        if (err) return cb(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return cb(err);
            return cb(null, addedUser);
          });
        } else {
          cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});
