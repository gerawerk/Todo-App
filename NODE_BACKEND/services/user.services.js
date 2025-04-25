const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');

class UserService {
  // ✅ Register a new user (now without manual hashing)
  static async registerUser({ email, password }) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const exists = await UserModel.findOne({ email });
      if (exists) {
        throw new Error('Email already in use');
      }

      // Create user with plain password (model will hash it)
      const user = await UserModel.create({
        email: email.toLowerCase().trim(),
        password: password
      });

      logger.info(`User registered: ${user.email}`);
      return user.toObject();
    } catch (err) {
      logger.error(`Registration error: ${err.message}`);
      throw new Error(`Registration failed: ${err.message}`);
    }
  }

  // ✅ Get user by email (unchanged)
  static async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        console.log("[INFO] No user found with that email");
        return null;
      }
      return user;
    } catch (err) {
      console.error("[ERROR] Get user error:", err);
      throw new Error("Failed to fetch user");
    }
  }

  // ✅ Verify user credentials (now using model's comparePassword)
  static async verifyCredentials(email, password) {
    try {
      const user = await UserModel.findOne({ email }).select('+password');
      
      if (!user) {
        throw new Error('User does not exist');
      }

      // Use the model's built-in comparison method
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);  // Should be true if comparison is correct

      if (!isMatch) {
        throw new Error('Incorrect password');
      }

      return user;
    } catch (err) {
      console.error("[ERROR] Login attempt failed:", err);
      throw new Error('Failed to verify credentials');
    }
  }

  // ✅ Generate JWT tokens (unchanged)
  static generateTokens(user) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
  
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secret keys are missing in the environment');
    }
  
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      accessSecret,
      { expiresIn: '15m' }
    );
  
    const refreshToken = jwt.sign(
      { userId: user._id },
      refreshSecret,
      { expiresIn: '7d' }
    );
  
    return { accessToken, refreshToken };
  }
  
}

module.exports = UserService;