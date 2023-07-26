import User from "../models/user.js";
import bcrypt from "bcrypt";
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);

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
  registerUser
};