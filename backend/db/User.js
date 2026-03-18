const mongoose = require("mongoose");
const crypto = require("crypto-js");

const secretKey = "bsjdsab12bsandb213";

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});
const Counter = mongoose.model("Counter", counterSchema);

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
    auto: true,
  },
  employeeID: {
    type: String,
    unique: true,
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
      status: {
        type: String,
        default: 'Pending'
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
  leaveRequestsHistory: [
    {
      subject: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, default: 'Pending' }
    }
  ]
});

// Pre-save hook to hash password and generate employeeID
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password") || user.isNew) {
    user.password = crypto.AES.encrypt(user.password, secretKey).toString();
  }

  // Generate employeeID only if it's a new user
  if (user.isNew) {
    const deptInitial = user.department?.charAt(0).toUpperCase() || 'X';
    const desigInitial = user.designation?.charAt(0).toUpperCase() || 'X';

    // Generate a unique employeeID
    const prefix = `${deptInitial}${desigInitial}`;

    const counter = await Counter.findOneAndUpdate(
      { key: prefix },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    user.employeeID = `${prefix}-${counter.count}`;
  }

  next();
});

userSchema.methods.decryptPassword = function () {
  const bytes = crypto.AES.decrypt(this.password, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};

const User = mongoose.model("User", userSchema);
module.exports = User;