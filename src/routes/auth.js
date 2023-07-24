import express from 'express';
import { isLoggedIn } from '../controllers/auth.controller.js';
import passport from 'passport';
import { googleStrategy } from '../passportConfig.js';
import User from '../models/user.js';
passport.use(googleStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

const router = express.Router();


router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.get('/login', (req, res) => {
  res.render('login.ejs', { hasMessages: false });
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
  "/profile",
  isLoggedIn,
  (req, res) => {
    res.send(`Welcome ${req.user.google.name}`);
  }
);
router.get('/all', async (req, res) => res.send(await User.find()));

export default router;
