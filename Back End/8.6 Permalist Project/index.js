import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: result.rows,
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: [],
    });
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const itemId = parseInt(req.body.updatedItemId);
  const newTitle = req.body.updatedItemTitle;

  if (newTitle && newTitle.trim()) {
    try {
      await db.query("UPDATE items SET title = $1 WHERE id = $2", [
        newTitle.trim(),
        itemId,
      ]);
      console.log("Item updated successfully");
    } catch (err) {
      console.error("Error updating item:", err);
    }
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const itemId = parseInt(req.body.deleteItemId);

  try {
    await db.query("DELETE FROM items WHERE id = $1", [itemId]);
    console.log("Item deleted successfully");
  } catch (err) {
    console.error("Error deleting item:", err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
