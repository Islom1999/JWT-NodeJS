const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  fullName: {
    type: "string",
    required: true,
    trim: true,
  },
  userName: {
    type: "string",
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: "string",
    required: true,
  },
  token: {
    type: "string",
    required: true,
  },
  refresh: {
    type: "string",
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Users", Users);
