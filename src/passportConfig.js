import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import  { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

async function verify(req, accessToken, refreshToken, profile, done, type)  {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    if (existingUser) {
      if (existingUser[type].id === profile.id) {
        return done(null, existingUser);
      } else {
        existingUser[type] = { id: profile.id };
        await existingUser.save();
      }
    } else {
      console.log('Creating new user...');
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        [type]: {
          id: profile.id
        },
      });
      await newUser.save();
      return done(null, newUser);
    }

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

export const githubStrategy = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback",
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  await verify(req, accessToken, refreshToken, profile, done, 'github');
});


export const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (user == null) return done(null, false, { message: "No user with that email" });
      const userPassword = user.hashedPassword;
      if (!userPassword || bcrypt.compare(password, userPassword)) {
        return done(null, false, { message: "password incorrect" });
      } else {
        return done(null, user);
      }
    } catch (e) {
      return done(e);
    }
  }
);