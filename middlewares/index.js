// external dependencies
const express = require("express");
const morgan = require("morgan");

// middlewares for main app
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({
    extended: true,
  }),
  express.json(),
];

// using middlwares in app.use
module.exports = (app) => {
  middleware.map((mw) => {
    app.use(mw);
  });
};
