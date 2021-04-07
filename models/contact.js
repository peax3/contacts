const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

contactSchema.pre("save", function () {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
});

module.exports = mongoose.model("Contact", contactSchema);
