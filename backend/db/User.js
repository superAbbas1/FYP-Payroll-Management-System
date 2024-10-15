const mongoose = require("mongoose");
const crypto = require("crypto-js");

// Define the secret key for encryption
const secretKey = "bsjdsab12bsandb213"; // Use a secure secret key

// Define the User schema
const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // This is automatically handled by MongoDB
  },
  employeeID: { 
    type: String,
    unique: true, // Ensure employeeID is unique
    required: true, // Make it a required field
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
  cnic: { type: String, unique: true },  // Ensure CNIC is unique
  joining: String,
  email: { type: String, unique: true },  // Ensure email is unique
  password: String,
  address: String,
  salary: String,
  status: String,
  role: {
    type: String,
    default: "employee",
  },

  // Provident Fund Fields
  providentFund: {
    balance: {
      type: Number,
      default: 0, // Initial provident fund balance
    },  
    history: [
      {
        month: String, // Store the month (e.g., "January")
        amount: Number, // Amount deducted for provident fund in that month
      }
    ]
  },

  // Loan History
  loanHistory: [
    {
      amount: Number, // Amount of loan requested
      date: Date, // Date of loan request
      approved: {
        type: Boolean,
        default: false, // Approval status, default is not approved
      },
      remainingBalance: Number, // Provident fund balance after loan approval
    }
  ],

  salaryHistory: [
    {
      salary: String,
      month: String, // You can use Date to store the full date and extract the month later
    }
  ],
});






// Encrypt password before saving
userSchema.pre("save", function (next) {
  const user = this;

  // Encrypt password only if it's new or modified
  if (user.isModified("password")) {
    user.password = crypto.AES.encrypt(user.password, secretKey).toString();
  }

  next();
});

// Method to decrypt password
userSchema.methods.decryptPassword = function () {
  const bytes = crypto.AES.decrypt(this.password, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;

