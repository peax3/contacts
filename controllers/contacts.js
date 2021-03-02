const { Types } = require("mongoose");
const contact = require("../models/contact");

const Contact = require("../models/contact");
const User = require("../models/user");

// @desc    Get all contacts
// @access  Private
exports.getContacts = async (req, res) => {
  // retrieve id from req
  const userId = Types.ObjectId(req.userId);
  // get contacts from database
  const contacts = await contact.find({ user: userId });

  // return payload
};

// @desc    create a post
// @access  Private
exports.addContact = async (req, res) => {
  // retrieve id from req
  const userId = Types.ObjectId(req.userId);

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
