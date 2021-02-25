const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@react-contact-cluster.giffr.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(helmet());

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
