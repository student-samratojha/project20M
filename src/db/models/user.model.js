const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
   languages: [
  {
    name: String,
    level: Number
  }
],
    stack: {
      type: String,
    },
    city: {
      type: String,
    },
    education: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum:["user","admin"],
      default:"user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    projects: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
