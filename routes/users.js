const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users");

const router = express.Router();

// @route   POST api/users
// @desc    Register a new user: Signup user
// @access  Public
router.post(
  "/",
  [
    check("fullName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 3 characters long"),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be more than eight(8) characters"),
  ],
  usersController.signup
);

module.exports = router;
