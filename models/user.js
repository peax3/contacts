const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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
    select: false,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

userSchema.pre("save", async function () {
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

module.exports = mongoose.model("User", userSchema);
