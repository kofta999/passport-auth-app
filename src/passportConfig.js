import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from './models/user.js';
import dotenv from 'dotenv';
dotenv.config();

async function verify(req, accessToken, refreshToken, profile, done, type)  {
  try {
    const existingUser = await User.findOne({ [`${type}.id`]: profile.id });
    if (existingUser) return done(null, existingUser);

    console.log('Creating new user...');
    const newUser = new User({
      name: profile.displayName,
      email: profile.emails ? profile.emails[0].value : null,
      [type]: {
        id: profile.id
      }
    });
    await newUser.save();
    return done(null, newUser);
  } catch (e) {
    return done(e, false);
  }
}



export const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
},  async (req, accessToken, refreshToken, profile, done) => {
  await verify(req, accessToken, refreshToken, profile, done, 'google');
});

export const facebookStrategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  passReqToCallback: true,
  profileFields: ["email", "id", "displayName"]
}, async (req, accessToken, refreshToken, profile, done) => {
  await verify(req, accessToken, refreshToken, profile, done, 'facebook');
});
