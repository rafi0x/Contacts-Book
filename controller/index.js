const { validationResult } = require("express-validator");
const ContactList = require("../Schema/Contact");

// showing data
exports.getAlldata = (req, res) => {
  ContactList.find()
    .then((data) => {
      res.render("contact", { data, error: {} });
    })
    .catch((err) => console.log(err));
};

// save and update data
exports.postSaveData = async (req, res) => {
  const inputErr = validationResult(req);
  if (!inputErr.isEmpty()) {
    // send error as json
    return res.json({
      error: inputErr.mapped(),
    });
  }
  try {
    const { name, email, phone, id } = req.body;
    const contactListData = new ContactList({
      name,
      email,
      phone,
    });
    await contactListData.save();
    return res.json({ save: "success" });
  } catch (error) {
    console.log(error);
  }
};

// Delete data
exports.getDeleteData = (req, res) => {
  const { id } = req.params;
  ContactList.findOneAndDelete({}, { _id: id })
    .then(() => res.redirect("/contact"))
    .catch((err) => console.log(err));
};

exports.postEditData = async (req, res) => {
  const name = req.body.editName;
  const email = req.body.editEmail.split(",");
  const phone = req.body.editPhone.split(",");
  const id = req.body.id;

  const inputErr = validationResult(req);
  if (!inputErr.isEmpty()) {
    // send error as json
    return res.json({
      error: inputErr.mapped(),
    });
  }
  try {
    await ContactList.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          email,
          phone,
        },
      }
    );
    return res.json({ save: "success" });
  } catch (error) {
    console.error(error);
  }
};
