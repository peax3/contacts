const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const contactsRoutes = require("./routes/contacts");

const mongoose = require("mongoose");

// load environment variables
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@react-contact-cluster.giffr.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

const app = express();

// middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/contacts", contactsRoutes);

// connect
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
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
