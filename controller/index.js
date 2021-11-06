const { validationResult } = require("express-validator");
const Contacts = require("../Schema/Contact");

// showing data
exports.getAlldata = async (req, res) => {
  try {
    const allContacts = await Contacts.find();
    res.locals.data = allContacts;
    return res.render("contact");
  } catch (error) {
    console.log(err);
  }
};
exports.exportData = async (req, res) => {
  try {
    const allContacts = await Contacts.find({}, { _id: false, __v: false });
    let expContact = [];
    allContacts.map((contact) => {
      let contactObj = {
        name: contact.name,
        email: contact.email.join(","),
        phone: contact.phone.join(","),
      };
      expContact.push(contactObj);
    });
    if (expContact.length > 0) return res.json(expContact);
    else return res.json(500, { err: "server error" });
  } catch (error) {
    console.log(error);
  }
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
    const contactListData = new Contacts({
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
  Contacts.findOneAndDelete({}, { _id: id })
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
    await Contacts.findOneAndUpdate(
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

exports.searchContacts = async (req, res) => {
  const input = req.params.input.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const keyword = new RegExp(input, "i");
  console.log(keyword);
  try {
    const foundContact = await Contacts.find(
      {
        $or: [{ name: keyword }, { email: keyword }, { phone: keyword }],
      },
      "name email phone"
    );
    console.log(foundContact);
    return res.status(200).json(foundContact);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
