import express from 'express';
import { isLoggedIn, registerUser } from '../controllers/auth.controller.js';
import passport from 'passport';
import { facebookStrategy, googleStrategy, localStrategy } from '../passportConfig.js';
import User from '../models/user.js';

passport.use(googleStrategy);
passport.use(facebookStrategy);
passport.use(localStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }),
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook")
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }),
);

router.get(
  "/profile",
  isLoggedIn,
  (req, res) => {
    res.render('profile.ejs');
  }
);

router.get(
  "/logout",
  isLoggedIn,
  (req, res) => {
    req.logout((err) => {
      if (err) res.redirect("/login");
      else res.redirect("/");
    });
  }
);

router.post("/register", registerUser);

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }));

router.get('/all', async (req, res) => res.send(await User.find()));

export default router;
