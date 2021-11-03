const { body } = require("express-validator");
const Contact = require("../Schema/Contact");

const contactValidator = [
  body("editName")
    .isLength({ min: 1, max: 16 })
    .withMessage("Invalid firstname")
    .trim(),
  body("editEmail").custom((input) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (input) {
      const data = input.split(",");
      if (data.length <= 3) {
        return data.map((email) => {
          const mail = phone.replace(/\s*/g, "");
          if (regex.test(mail)) {
            return true;
          }
          throw new Error("Invalid Email Address!");
        });
      } else {
        throw new Error("cant add more then 3 emails");
      }
    } else {
      throw new Error("Invalid Email Address!");
    }
  }),
  body("editPhone")
    .not()
    .isEmpty()
    .withMessage("cant empty")
    .custom((input) => {
      const regex = /(^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8})$/;
      if (input) {
        const data = input.split(",");
        if (data.length <= 3) {
          return data.map((phone) => {
            const phn = phone.replace(/\s*/g, "");
            if (regex.test(phn)) {
              return true;
            }
            throw new Error("Invalid Phone Number!");
          });
        } else {
          throw new Error("cant add more then 3 numbers");
        }
      } else {
        throw new Error("Invalid Phone Number!");
      }
    }),
];
module.exports = contactValidator;
