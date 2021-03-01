const express = require("express");

const router = express.Router();

// @route   GET api/contacts
// @desc    Get all contacts
// @access  Private
router.get("/");

// @route   POST api/contacts
// @desc    create a post
// @access  Private
router.post("/");

// @route   PUT api/contacts/:id
// @desc    edit a post
// @access  Private
router.put("/:contactId");

// @route   DELETE api/contacts/:id
// @desc    delete a post
// @access  Private
router.delete("/:contactId");

module.exports = router;
