const { body } = require("express-validator");
const Contact = require("../Schema/Contact");

const contactValidator = [
  body("name")
    .isLength({ min: 1, max: 16 })
    .withMessage("Invalid firstname")
    .trim(),
  body("email").custom((input) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (input) {
      if (typeof input === "string") {
        if (regex.test(input)) {
          return true;
        }
        throw new Error("Invalid Email Address!");
      }
      return input.map((email) => {
        if (regex.test(email)) {
          return true;
        }
        throw new Error("Invalid Email Address!");
      });
    }
    throw new Error("Invalid Email Address!");
  }),
  body("phone")
    .not()
    .isEmpty()
    .withMessage("cant empty")
    .custom((input) => {
      const regex = /(^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8})$/;
      if (input) {
        if (typeof input === "string") {
          if (regex.test(input)) {
            return true;
          }
          throw new Error("Invalid Phone Number!");
        }
        return input.map((phone) => {
          if (regex.test(phone)) {
            return true;
          }
          throw new Error("Invalid Phone Number!");
        });
      }
      throw new Error("Invalid Phone Number!");
    }),
];
module.exports = contactValidator;
