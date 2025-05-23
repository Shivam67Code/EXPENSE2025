const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// Generate JWT Token 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    // Check if req.body exists before trying to destructure from it
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    // Log the request body to debug
    console.log("Request body:", req.body);

    const { fullName, email, password, profileImageUrl } = req.body || {};

    // Validation: Check for missing fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields are Required 📂" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email Already Exists" });
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ message: "Error Registering User", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Get User Information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user info error:", err);
    res.status(500).json({ message: "Error fetching user information", error: err.message });
  }
};