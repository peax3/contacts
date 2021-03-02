const express = require("express");
const { check } = require("express-validator");
const { isAuth } = require("../middleware/is-auth");

const contactController = require("../controllers/contacts");

const router = express.Router();

// @route   GET api/contacts
// @desc    Get all contacts
// @access  Private
router.get("/", isAuth);

// @route   POST api/contacts
// @desc    create a post
// @access  Private
router.post("/", isAuth, contactController.addContact);

// @route   PUT api/contacts/:id
// @desc    edit a post
// @access  Private
router.put("/:contactId");

// @route   DELETE api/contacts/:id
// @desc    delete a post
// @access  Private
router.delete("/:contactId");

module.exports = router;
