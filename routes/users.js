const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users");

const router = express.Router();

// @route   POST api/users
// @desc    Register a new user: Signup user
// @access  Public
router.post(
  "/register",
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
      .isLength({ min: 6 })
      .withMessage("Password must be more than six(6) characters"),
  ],
  usersController.signup
);

module.exports = router;
