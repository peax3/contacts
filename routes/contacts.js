const express = require("express");
const multer = require("multer");
const { isAuth } = require("../middleware/is-auth");

const contactController = require("../controllers/contacts");

const router = express.Router();

const fileUpload = multer(); // file upload

// @route   GET api/contacts
// @desc    Get all contacts
// @access  Private
router.get("/", isAuth, contactController.getContacts);

// @route   POST api/contacts
// @desc    create a contact
// @access  Private
router.post(
  "/",
  isAuth,
  fileUpload.single("image"),
  contactController.addContact
);

// @route   PUT api/contacts/:id
// @desc    edit a contact
// @access  Private
router.put(
  "/:contactId",
  isAuth,
  fileUpload.single("image"),
  contactController.updateContact
);

// @route   DELETE api/contacts/:id
// @desc    delete a contact
// @access  Private
router.delete("/:contactId", isAuth, contactController.deleteContact);

module.exports = router;
