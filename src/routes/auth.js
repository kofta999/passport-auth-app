import express from 'express';
import { isLoggedIn, isNotLoggedIn, registerUser, logOut } from '../controllers/auth.controller.js';
import passport from 'passport';
import { githubStrategy, googleStrategy, localStrategy } from '../passportConfig.js';
import User from '../models/user.js';

passport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(localStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

const router = express.Router();


// Passport Auths

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
  "/auth/github",
  passport.authenticate("github")
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }),
);

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }));

// Page Rendering

router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register.ejs');
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login.ejs');
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render('profile.ejs');
});

// Etc Routes

router.get("/logout", isLoggedIn, logOut);

router.post("/register", registerUser);

router.get('/all', async (req, res) => res.send(await User.find()));

export default router;
