// index.js
const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    let result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.send({ message: "Login successful", user });
    } else {
      res.status(401).send({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to login" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    let employees = await User.find();
    console.log("Employees fetched: ", employees);
    res.send(employees);
  } catch (err) {
    console.error("Failed to fetch employees: ", err);
    res.status(500).send({ error: "Failed to fetch employees" });
  }
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await User.findByIdAndDelete(id);
    if (employee) {
      res.status(200).send({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error("Failed to delete employee: ", err);
    res.status(500).send({ error: "Failed to delete employee" });
  }
});

app.post("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const { month, dates } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Employee not found" });
    }

    const existingAttendance = user.attendance.find(a => a.month === month);
    if (existingAttendance) {
      existingAttendance.dates = dates;
    } else {
      user.attendance.push({ month, dates });
    }

    await user.save();
    res.status(200).send({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Failed to save attendance: ", error);
    res.status(500).send({ error: "Failed to save attendance" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});


