

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const attendanceSchema = new mongoose.Schema({
  month: { type: String, required: true },
  dates: { 
    type: Map, 
    of: String, 
    default: {} 
  },
});

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    default: "employee",
  },
  attendance: [attendanceSchema],
});

userSchema.pre("save", async function(next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
