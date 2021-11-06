const route = require("express").Router();
const {
  getAlldata,
  postSaveData,
  postEditData,
  getDeleteData,
  searchContacts,
  exportData,
} = require("../controller");

const contactValidator = require("../validator/contact");
const contactEditValidator = require("../validator/editContact");

route.route("/").get(getAlldata).post(contactValidator, postSaveData);
route.route("/export").get(exportData);
route.route("/edit").post(contactEditValidator, postEditData);
route.route("/search/:input").post(searchContacts);
route.get("/delete/:id", getDeleteData);

module.exports = route;
