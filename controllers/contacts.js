const { Types } = require("mongoose");
const contact = require("../models/contact");

const Contact = require("../models/contact");
const { findById } = require("../models/user");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
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
    return next(err);
  }
};

exports.addContact = async (req, res, next) => {
  return next(new ErrorResponse("custom", 400));
};

// @desc    create a contact
// @access  Private
// exports.addContact = async (req, res) => {
//   // retrieve id from req
//   const userId = Types.ObjectId(req.userId);
//   console.log(userId);

//   const { firstName, lastName, email, phone } = req.body;

//   // if firstName and lastName undefined - error
//   if (!firstName && !lastName) {
//     return res.status(422).json({
//       message:
//         "first name and last name cannot be empty. Please fill one or both fields",
//     });
//   }
//   // if phone and email undefined - error
//   if (!email && !phone) {
//     return res.status(422).json({
//       message:
//         "phone and email cannot be empty. Please enter fill one or both fields",
//     });
//   }

//   try {
//     // create new contact and save
//     const newContact = new Contact({
//       firstName,
//       lastName,
//       phone,
//       email,
//       creator: userId,
//     });

//     const contact = await newContact.save();

//     // find user. update it and save
//     const user = await User.findById(userId);
//     user.contacts.push(contact._id);
//     await user.save();

//     // return payload
//     return res.status(201).json({ contact, message: "contact created" });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "server error" });
//   }
// };

exports.updateContact = async (req, res, next) => {
  const userId = Types.ObjectId(req.userId);
  const contactId = Types.ObjectId(req.params.contactId);

  const { firstName, lastName, email, phone } = req.body;

  // if firstName and lastName undefined - error
  if (!firstName && !lastName) {
    return next(
      new ErrorResponse(
        "first name and last name cannot be empty. Please fill one or both fields",
        422
      )
    );
  }
  // if phone and email undefined - error
  if (!email && !phone) {
    return next(
      new ErrorResponse(
        "phone and email cannot be empty. Please enter fill one or both fields",
        422
      )
    );
  }

  try {
    const contactToUpdate = await Contact.findById(contactId);

    if (contactToUpdate.creator.toString() !== userId.toString()) {
      return next(new ErrorResponse("Not Authorised", 403));
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
    return next(err);
  }
};

exports.deleteContact = async (req, res, next) => {
  const userId = Types.ObjectId(req.userId);
  const contactId = Types.ObjectId(req.params.contactId);

  try {
    const contactTodelete = await Contact.findById(contactId);
    const user = await User.findById(userId);

    if (contactTodelete.creator.toString() !== userId.toString()) {
      return next(new ErrorResponse("Not Authorized"), 403);
    }

    // remove the contact id from the user and save
    user.contacts.pull(contactId);
    await user.save();

    // delete
    await contactTodelete.remove();

    return res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    return next(err);
  }
};
