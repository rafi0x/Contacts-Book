const express = require("express");
const morgan = require("morgan");
const mongosse = require("mongoose");
// getting contactRoute
const contactRoute = require("./router");

// using express as app
const app = express();

// using ejs as view engine
app.set("view engine", "ejs");
// using morgan in app
app.use(morgan("dev"));
// json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using contactRoute in /contact
app.use("/contact", contactRoute);
// index route
app.get("/", (req, res) => {
  res.render("index");
});

// database and server connection
const PORT = process.env.PORT || "5050";
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
