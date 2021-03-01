const express = require("express");

const router = express.Router();

// @route   POST api/auth
// @desc    login in user: authenticate user and return token
// @access  Public
router.post("/");

// @route   GET api/auth
// @desc    get logged in user
// @access  Private
router.get("/");

module.exports = router;
