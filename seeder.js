const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load environment variables
dotenv.config();

// load models
const User = require("./models/user");
const Contact = require("./models/contact");

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@react-contact-cluster.giffr.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

// connect to DB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_mockData/users.json`, "utf-8")
);
const contacts = JSON.parse(
  fs.readFileSync(`${__dirname}/_mockData/contacts.json`, "utf-8")
);

// import data into DB
const importData = async () => {
  try {
    await User.create(users);
    await Contact.create(contacts);
    console.log("Data imported....".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Contact.deleteMany();
    console.log("Data deleted....".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
