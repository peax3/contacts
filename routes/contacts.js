const express = require("express");
const { check } = require("express-validator");
const { isAuth } = require("../middleware/is-auth");

const contactController = require("../controllers/contacts");

const router = express.Router();

// @route   GET api/contacts
// @desc    Get all contacts
// @access  Private
router.get("/", isAuth, contactController.getContacts);

// @route   POST api/contacts
// @desc    create a contact
// @access  Private
router.post("/", isAuth, contactController.addContact);

// @route   PUT api/contacts/:id
// @desc    edit a contact
// @access  Private
router.put("/:contactId", isAuth, contactController.updateContact);

// @route   DELETE api/contacts/:id
// @desc    delete a contact
// @access  Private
router.delete("/:contactId", isAuth, contactController.deleteContact);

module.exports = router;
