const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

// @desc    login in user: authenticate user and return token
// @access  Public
exports.login = async (req, res, next) => {
  // check for validation console error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // find user with email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // check if password is correct
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });
    // return token payload
    return res.status(200).json({ token });
  } catch (err) {
    return next();
  }
};

// @desc    get logged in user
exports.getUser = async (req, res, next) => {
  // get the user id from the request
  const userId = mongoose.Types.ObjectId(req.userId);

  try {
    // find the user in the database
    const user = await User.findById(userId);
    // return user
    return res.status(200).json(user);
  } catch (err) {
    return next();
  }
};

// @desc    Register a new user: Signup user
// @access  Public
exports.signup = async (req, res, next) => {
  // validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  try {
    // check if a user with the email exists
    let user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorResponse("A user with this email already exists"),
        422
      );
    }

    // save user
    const newUser = await User.create(req.body);

    // generate token
    const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    // return payload
    res
      .status(201)
      .json({ message: "User created", token: token, userId: newUser._id });
  } catch (err) {
    next();
  }
};
