const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    default: 0,
  },
});

FamilySchema.post("remove", function (next) {
  Person.deleteMany({ Family: this._id }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  next();
});
module.exports = mongoose.model("Families", FamilySchema);
