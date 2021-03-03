const { Types } = require("mongoose");
const contact = require("../models/contact");

const Contact = require("../models/contact");
const { findById } = require("../models/user");
const User = require("../models/user");

// @desc    Get all contacts
// @access  Private
exports.getContacts = async (req, res) => {
  // retrieve id from req
  const userId = Types.ObjectId(req.userId);
  try {
    // get contacts from database and sort
    const contacts = await contact
      .find({ creator: userId })
      .collation({ locale: "en", strength: 2 })
      .sort({ firstName: 1 });

    // return payload
    res.status(200).json(contacts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

// @desc    create a contact
// @access  Private
exports.addContact = async (req, res) => {
  // retrieve id from req
  const userId = Types.ObjectId(req.userId);
  console.log(userId);

  const { firstName, lastName, email, phone } = req.body;

  // if firstName and lastName undefined - error
  if (!firstName && !lastName) {
    return res.status(422).json({
      message:
        "first name and last name cannot be empty. Please fill one or both fields",
    });
  }
  // if phone and email undefined - error
  if (!email && !phone) {
    return res.status(422).json({
      message:
        "phone and email cannot be empty. Please enter fill one or both fields",
    });
  }

  try {
    // create new contact and save
    const newContact = new Contact({
      firstName,
      lastName,
      phone,
      email,
      creator: userId,
    });

    const contact = await newContact.save();

    // find user. update it and save
    const user = await User.findById(userId);
    user.contacts.push(contact._id);
    await user.save();

    // return payload
    return res.status(201).json({ contact, message: "contact created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

exports.updateContact = async (req, res) => {
  const userId = Types.ObjectId(req.userId);
  const contactId = Types.ObjectId(req.params.contactId);

  const { firstName, lastName, email, phone } = req.body;

  // if firstName and lastName undefined - error
  if (!firstName && !lastName) {
    return res.status(422).json({
      message:
        "first name and last name cannot be empty. Please fill one or both fields",
    });
  }
  // if phone and email undefined - error
  if (!email && !phone) {
    return res.status(422).json({
      message:
        "phone and email cannot be empty. Please enter fill one or both fields",
    });
  }

  try {
    const contactToUpdate = await Contact.findById(contactId);

    if (contactToUpdate.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not Authorised" });
    }

    contactToUpdate.firstName = firstName;
    contactToUpdate.lastName = lastName;
    contactToUpdate.phone = phone;
    contactToUpdate.email = email;

    const updatedContact = await contactToUpdate.save();

    return res
      .status(200)
      .json({ message: "contact updated", contact: updatedContact });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

exports.deleteContact = async (req, res) => {
  const userId = Types.ObjectId(req.userId);
  const contactId = Types.ObjectId(req.params.contactId);

  try {
    const contactTodelete = await Contact.findById(contactId);
    const user = await User.findById(userId);

    if (contactTodelete.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not Authorised" });
    }

    // remove the contact id from the user and save
    user.contacts.pull(contactId);
    await user.save();

    // delete
    await contactTodelete.remove();

    return res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};
