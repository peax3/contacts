const path = require("path");
const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");
const errorHandler = require("./middleware/error");

const mongoose = require("mongoose");

// load environment variables
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(xss());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

app.use(errorHandler); // error handler

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@react-contact-cluster.giffr.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

const PORT = parseInt(process.env.PORT, 10);

// connect
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

connectDB();
