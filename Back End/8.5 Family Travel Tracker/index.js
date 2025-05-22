import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT),
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

async function checkVisisted() {
  const userId = Number(currentUserId) || 1;

  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [userId]
  );

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

async function getCurrentUser() {
  const userId = Number(currentUserId) || 1;

  const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    const fallbackResult = await db.query(
      "SELECT * FROM users ORDER BY id LIMIT 1"
    );
    if (fallbackResult.rows.length > 0) {
      currentUserId = fallbackResult.rows[0].id;
      return fallbackResult.rows[0];
    }
    return { id: 1, name: "Default User", color: "teal" };
  }
}

app.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    const currentUser = await getCurrentUser();
    currentUserId = currentUser.id;
    const countries = await checkVisisted();

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser.color,
      currentUser: currentUser,
    });
  } catch (err) {
    console.error("Error in root route:", err);
    res.status(500).send("An error occurred");
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  try {
    const name = req.body.name;
    const color = req.body.color;

    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *",
      [name, color]
    );

    if (result.rows.length > 0) {
      currentUserId = result.rows[0].id;
    }

    res.redirect("/");
  } catch (err) {
    console.error("Error creating user:", err);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
