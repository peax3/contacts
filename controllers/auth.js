const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// @desc    login in user: authenticate user and return token
// @access  Public
exports.login = async (req, res, next) => {
  // check for validation console error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ error: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // find user with email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "A User with this email could not be found" });
    }
    // check if password is correct
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).send({ message: "Wrong Password" });
    }
    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    // return token payload
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
