const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

// @route   POST api/auth
// @desc    login in user: authenticate user and return token
// @access  Public
router.post(
  "/",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// @route   GET api/auth
// @desc    get logged in user
// @access  Private
router.get("/");

module.exports = router;
