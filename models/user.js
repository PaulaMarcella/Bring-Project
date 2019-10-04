"use strict";

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  // role: {
  //   required: true,
  //   enum: ["User", "Organisation"]
  // },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  imageUrl: {
    type: String,
    default: "../images/default-user-icon-4.jpg"
  },
  _donationPost: [
    {
      type: ObjectId,
      default: "",
      ref: "DonationPost"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
