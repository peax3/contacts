const { Types } = require("mongoose");

const Contact = require("../models/contact");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const { uploadImage } = require("../utils/uploadImage");
const { deleteImage } = require("../utils/uploadImage");

// @desc    Get all contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
  // retrieve id from req
  const userId = Types.ObjectId(req.userId);
  try {
    // get contacts from database and sort
    const contacts = await Contact.find({ creator: userId })
      .collation({ locale: "en", strength: 2 })
      .sort({ firstName: 1 });

    // return payload
    res.status(200).json(contacts);
  } catch (err) {
    return next();
  }
};

// @desc    create a contact
// @access  Private
exports.addContact = async (req, res, next) => {
  // retrieve id from req
  const userId = req.userId;
  const { firstName, lastName, email, phone } = req.body;

  // if firstName and lastName undefined - error
  if (!firstName && !lastName) {
    return next(
      new ErrorResponse(
        "First and Last name cannot be empty. Please fill one or both fields",
        422
      )
    );
  }
  // if phone and email undefined - error
  if (!firstName && !lastName) {
    return next(
      new ErrorResponse(
        "Phone and Email cannot be empty. Please enter fill one or both fields",
        422
      )
    );
  }

  let newContact = {
    firstName,
    lastName,
    email,
    phone,
    creator: userId,
  };

  if (req.file) {
    try {
      const uploadedImage = await uploadImage(req.file);
      const { secure_url, public_id } = uploadedImage;
      const image = {
        imageUrl: secure_url,
        imageId: public_id,
      };
      newContact = { ...newContact, image }; // add image details to new contact
    } catch (err) {
      return next(new ErrorResponse(err.message, 400));
    }
  }

  try {
    const savedContact = await Contact.create(newContact);

    // find user. update it and save
    const user = await User.findById(userId);
    user.contacts.push(savedContact._id);
    await user.save();

    return res
      .status(201)
      .json({ contact: savedContact, message: "contact created" });
  } catch (err) {
    return next();
  }
};

// @desc    update a contact
// @access  Private
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
    // check if the user is the creator of contacT
    if (contactToUpdate.creator.toString() !== userId.toString()) {
      return next(new ErrorResponse("Not Authorised", 403));
    }
    // check if contact exist
    if (!contactToUpdate) {
      return next(new ErrorResponse("Contact not found", 404));
    }

    let contact = {
      firstName,
      lastName,
      phone,
      email,
    };

    if (req.file) {
      try {
        // delete previous image
        const deleted = await deleteImage(contactToUpdate.image["imageId"]);
        // upload new Image
        const uploadedImage = await uploadImage(req.file);
        const { secure_url, public_id } = uploadedImage;
        const image = {
          imageUrl: secure_url,
          imageId: public_id,
        };
        contact = { ...contact, image }; // add image details to new contact
      } catch (err) {
        return next(new ErrorResponse(err.message, 400));
      }
    }

    const updatedContact = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "contact updated", contact: updatedContact });
  } catch (err) {
    return next();
  }
};

// @desc    delete a contact
// @access  Private
exports.deleteContact = async (req, res, next) => {
  const userId = Types.ObjectId(req.userId);
  const contactId = Types.ObjectId(req.params.contactId);

  try {
    const contactTodelete = await Contact.findById(contactId);
    const user = await User.findById(userId);

    if (contactTodelete.creator.toString() !== userId.toString()) {
      return next(new ErrorResponse("Not Authorized"), 403);
    }

    // check if contact exist
    if (!contactTodelete) {
      return next(new ErrorResponse("Contact not found", 404));
    }

    // remove the contact id from the user and save
    user.contacts.pull(contactId);
    await user.save();

    // delete image from cloud
    await deleteImage(contactTodelete.image["imageId"]);
    // delete
    await contactTodelete.remove();

    return res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    return next();
  }
};
