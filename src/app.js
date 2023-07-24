import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to mongoose'))
  .catch((e) => console.log(e.message));

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.get('/', (req, res) => res.send('homepage'));

app.use('/', auth);
export default app;