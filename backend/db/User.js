const mongoose = require("mongoose");
const crypto = require("crypto-js");
const bcrypt = require("bcrypt");

// Define the secret key for encryption
const secretKey = "bsjdsab12bsandb213"; // Use a secure secret key

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  month: { type: String, required: true },
  dates: { 
    type: Map, 
    of: String, 
    default: {} 
  },
});

// Define the User schema
const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // This is automatically handled by MongoDB
  },
  employeeID: { 
    type: String,
    unique: true, 
    required: true, 
  },
  fname: String,
  lname: String,
  department: String,
  designation: String,
  city: String,
  phoneNum: String,
  bankName: String,
  accountName: String,
  accountNum: String,
  cnic: { type: String, unique: true },  
  joining: String,
  email: { type: String, unique: true },  
  password: String,
  address: String,
  salary: String,
  status: String,
  role: {
    type: String,
    default: "employee",
  },
  attendance: [attendanceSchema],

  
  providentFund: {
    balance: {
      type: Number,
      default: 0,
    },  
    history: [
      {
        month: String, 
        amount: Number, 
      }
    ]
  },

 
  loanHistory: [
    {
      amount: Number,
      date: Date, 
      approved: {
        type: Boolean,
        default: false, 
      },
      remainingBalance: Number, 
    }
  ],

  salaryHistory: [
    {
      salary: String,
      month: String, 
    }
  ],
});


userSchema.pre("save", async function(next) {
  const user = this;


  if (user.isModified("password") || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});


userSchema.methods.decryptPassword = function () {
  const bytes = crypto.AES.decrypt(this.password, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};


const User = mongoose.model("User", userSchema);
module.exports = User;
