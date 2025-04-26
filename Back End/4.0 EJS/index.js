import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const today = new Date();
  const day = today.getDay();
  let typeOfDay = "";
  let adv = "";
  if (day === 0 || day === 6) {
    typeOfDay = "weekend";
    adv = " it's time to have fun";
  } else {
    typeOfDay = "weekday";
    adv = " it's time to work hard";
  }
  res.render("index.ejs", {
    dayType: typeOfDay,
    advice: adv,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
