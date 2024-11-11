const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Eliminamos las estrategias de Google y GitHub
/*
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Lógica de autenticación con Google
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Lógica de autenticación con GitHub
    }
  )
);
*/

module.exports = passport;
