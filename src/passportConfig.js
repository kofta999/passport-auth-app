import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/user.js';
import dotenv from 'dotenv';
dotenv.config();

export const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ 'google.id': profile.id });
    if (existingUser) return done(null, existingUser);

    console.log('Creating new user...');
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      }
    });
    await newUser.save();
    return done(null, newUser);
  } catch (e) {
    return done(e, false);
  }
});
