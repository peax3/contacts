const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
