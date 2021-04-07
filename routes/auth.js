const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");
const { isAuth } = require("../middleware/is-auth");

const router = express.Router();

// @route   POST api/auth/login
// @desc    login in user: authenticate user and return token
// @access  Public
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// @route   POST api/auth/register
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
  authController.signup
);

// @route   GET api/auth/me
// @desc    get logged in user
// @access  Private
router.get("/me", isAuth, authController.getUser);

module.exports = router;
