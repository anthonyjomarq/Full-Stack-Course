import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Insert user into database
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, password]
    );
    console.log("User registered successfully");
    res.redirect("/login");
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation error code
      console.log("Email already exists");
      res.send("Email already registered. Please use a different email.");
    } else {
      console.log("Error:", err);
      res.send("Registration failed. Please try again.");
    }
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      console.log("Login successful");
      res.render("secrets.ejs"); // or wherever you want to redirect
    } else {
      console.log("Invalid credentials");
      res.send("Invalid email or password");
    }
  } catch (err) {
    console.log("Error:", err);
    res.send("Login failed. Please try again.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
