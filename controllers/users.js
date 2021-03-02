const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

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
      return res
        .status(422)
        .json({ message: "A user with this email already exists" });
    }

    // else register as new  user
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // save user
    const result = await user.save();

    // return payload
    res.status(201).json({ message: "User created", userId: result._id });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
