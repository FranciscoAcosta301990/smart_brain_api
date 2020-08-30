const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const img = require("./controllers/img");

const pgdatabase = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {res.send("it is working!")});

// input data for login, and authentication of that data.
app.post("/signin", signin.handleSignin(pgdatabase, bcrypt));

// input data from a new user.
app.post("/register", register.handleRegister(pgdatabase, bcrypt));

// output user if the id is correct.
app.get("/profile/:id", signin.handleSignin(pgdatabase));

// PUT that increase the "entries".
app.put("/image", img.handleImage(pgdatabase));

// POST to recive the imageurl from the frontend.
app.post("/imageurl", (req, res) => {img.handleApiCall(req,res)});

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log("app is running in port " + PORT);
});

/*
/ Sign in -> POST | return -> success (user found) or fail (user not found).
/ Register -> POST | return -> new user data.
/ profile/.userid -> GET | return -> user data for login.
/ image posted -> PUT | increase the user rank.
*/
