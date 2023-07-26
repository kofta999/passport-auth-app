import User from "../models/user.js";
import bcrypt from "bcrypt";
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/login");

const isNotLoggedIn = (req, res, next) => req.isAuthenticated() ? res.redirect("/") : next();

const logOut = (req, res) => {
  req.logout((err) => {
    if (err) res.redirect("/login");
    else res.redirect("/");
  });
};

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      hashedPassword
    });
    await newUser.save();
    res.redirect("/login");
  } catch (e) {
    console.log(e.message);
    res.redirect("/register");
  }
};

export {
  isLoggedIn,
  isNotLoggedIn,
  registerUser,
  logOut
};