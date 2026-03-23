const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URI;
async function connect() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

module.exports = connect;