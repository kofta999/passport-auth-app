import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from "express-session";
import passport from "passport";
import expressEjsLayouts from "express-ejs-layouts";
import flash from "express-flash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to mongoose'))
  .catch((e) => console.log(e.message));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.get('/', (req, res) => res.render('index.ejs'));
app.use('/', auth);

export default app;