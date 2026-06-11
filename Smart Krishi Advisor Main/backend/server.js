const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (Get your string from MongoDB Atlas)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/smart_krishi";

// This tells Node.js to use your computer's internal database
const localURI = "mongodb://127.0.0.1:27017/smart_krishi";

mongoose.connect(localURI)
  .then(() => console.log("🍃 SUCCESS: Connected to Local MongoDB!"))
  .catch(err => console.log("❌ DB Error: Is MongoDB Service running?", err));

// --- USER MODEL ---
const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  id: { 
    type: String, 
    required: true, 
    unique: true,
    // This is the extra guard for 10 digits or @gmail
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v) || v.toLowerCase().endsWith('@gmail.com');
      },
      message: props => `${props.value} must be 10 digits or a @gmail.com address!`
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8 // Stops passwords shorter than 8 characters
  },
  role: { 
    type: String, 
    default: 'user' 
  }
});
const User = mongoose.model('User', UserSchema);

// --- ROUTES ---

// 1. Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, id, password } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ id });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({ fullName, id, password, role: 'user' });
    await newUser.save();
    res.status(201).json({ message: "Farmer Registered Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findOne({ id, password }); // In real apps, use bcrypt to compare

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  res.json({ 
  fullName: user.fullName, 
  id: user.id, 
  role: user.role 
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));