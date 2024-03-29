const express = require("express");
const morgan = require("morgan");
const mongosse = require("mongoose");

// modddlewares
const middlewares = require("./middlewares");

// getting contactRoute
const contactRoute = require("./router");

// using express as app
const app = express();

// using ejs as view engine
app.set("view engine", "ejs");

// using middleware
middlewares(app);

// using contactRoute in /contact
app.use("/contact", contactRoute);
// index route
app.get("/", (req, res) => {
  res.redirect("/contact");
});

// database and server connection
const PORT = process.env.PORT || "5000";
const databaseUrl = "mongodb://localhost:27017/admin";
mongosse
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
