const UserServices = require('../services/user.services');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserServices.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Register new user (includes hashing inside the service)
    const newUser = await UserServices.registerUser({ email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
      }
    });

  } catch (error) {
    console.error('---> err -->', error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Verify credentials
    const user = await UserServices.verifyCredentials(email, password);

    // Generate JWT tokens
    const tokens = UserServices.generateTokens(user);

    res.status(200).json({
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: error.message });
  }
};
