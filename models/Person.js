const mongoose = require("mongoose");
const FamilySchema = require("../models/Family");
const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  Family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Families",
    required: true,
  },
});

module.exports = mongoose.model("People", PersonSchema);
