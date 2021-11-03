const route = require("express").Router();
const {
  getAlldata,
  postSaveData,
  postEditData,
  getDeleteData,
} = require("../controller");

const contactValidator = require("../validator/contact");
const contactEditValidator = require("../validator/editContact");

route.route("/").get(getAlldata).post(contactValidator, postSaveData);
route.route("/edit").post(contactEditValidator, postEditData);
route.get("/delete/:id", getDeleteData);

module.exports = route;
