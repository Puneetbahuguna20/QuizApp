const router = require("express").Router();
const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const crypto = require("crypto");

// In-memory storage for testing when MongoDB is not available
let inMemoryUsers = [];

// Helper function to check if a string looks like a hash
const isHash = (str) => {
  // Check if it looks like a SHA-256 hash (64 characters, hex)
  return /^[a-f0-9]{64}$/i.test(str);
};

// Helper function to hash password with bcrypt
const hashPasswordWithBcrypt = async (password) => {
  const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
  return await bcrypt.hash(password, salt);
};

// user registration
router.post("/register", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (User.db.readyState !== 1) {
      // Use in-memory storage as fallback
      console.log('Using in-memory storage for registration');
      
      // Check if user already exists in memory
      const existingUser = inMemoryUsers.find(u => u.email === req.body.email);
      if (existingUser) {
        return res.status(400).send({ 
          message: "User already exists", 
          success: false 
        });
      }

      // Handle password - if it's already hashed from frontend, hash it again with bcrypt
      let finalPassword;
      if (isHash(req.body.password)) {
        console.log('🔐 Password already hashed from frontend, applying bcrypt hash');
        finalPassword = await hashPasswordWithBcrypt(req.body.password);
      } else {
        console.log('🔐 Password not hashed, applying bcrypt hash');
        finalPassword = await hashPasswordWithBcrypt(req.body.password);
      }

      // Create new user in memory
      const newUser = {
        _id: 'mem-' + Date.now(),
        name: req.body.name,
        email: req.body.email,
        password: finalPassword,
        role: req.body.role || 'student',
        createdAt: new Date(),
        // Add additional security fields
        lastLogin: null,
        loginAttempts: 0,
        isLocked: false,
      };
      
      inMemoryUsers.push(newUser);

      // Print detailed registration data to terminal
      console.log('\n===== NEW USER REGISTERED (In-Memory) =====');
      console.log('User details:', {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        passwordHashed: !!newUser.password,
      });
      
      // Print in-memory database information
      console.log('In-memory storage status:', {
        active: true,
        totalUsers: inMemoryUsers.length,
        mongoDBConnected: User.db.readyState === 1
      });
      
      // Print user collection information
      console.log('Users collection (in-memory):', {
        totalUsers: inMemoryUsers.length,
        newUserId: newUser._id
      });
      console.log('=======================================\n');

      // Generate token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: "1d",
      });

      return res.status(201).send({
        message: "User created successfully (in-memory storage)",
        success: true,
        token: token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      });
    }

    // MongoDB is available - use normal flow
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }

    // Handle password - if it's already hashed from frontend, hash it again with bcrypt
    let finalPassword;
    if (isHash(req.body.password)) {
      console.log('🔐 Password already hashed from frontend, applying bcrypt hash');
      finalPassword = await hashPasswordWithBcrypt(req.body.password);
    } else {
      console.log('🔐 Password not hashed, applying bcrypt hash');
      finalPassword = await hashPasswordWithBcrypt(req.body.password);
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: finalPassword,
      role: req.body.role || 'student',
    });
    
    await newUser.save();

    // Print detailed registration data to terminal
    console.log('\n===== NEW USER REGISTERED (MongoDB) =====');
    console.log('User details:', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      passwordHashed: !!newUser.password,
    });
    
    // Print database information
    console.log('Database status:', {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    });
    
    // Print collection information
    const usersCount = await User.countDocuments();
    console.log('Users collection:', {
      totalUsers: usersCount,
      newUserId: newUser._id.toString()
    });
    console.log('=======================================\n');

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "User created successfully",
      success: true,
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (User.db.readyState !== 1) {
      // Use in-memory storage as fallback
      console.log('Using in-memory storage for login');
      
      const user = inMemoryUsers.find(u => u.email === req.body.email);
      if (!user) {
        return res.status(400).send({ 
          message: "User does not exist", 
          success: false 
        });
      }

      // Handle password comparison
      let isValidPassword = false;
      if (isHash(req.body.password)) {
        console.log('🔐 Password already hashed from frontend, comparing with stored hash');
        // For pre-hashed passwords, we compare the bcrypt hash of the frontend hash
        isValidPassword = await bcrypt.compare(req.body.password, user.password);
      } else {
        console.log('🔐 Password not hashed, comparing with stored hash');
        isValidPassword = await bcrypt.compare(req.body.password, user.password);
      }

      if (!isValidPassword) {
        return res.status(400).send({ 
          message: "Invalid password", 
          success: false 
        });
      }

      // Update last login
      user.lastLogin = new Date();
      user.loginAttempts = 0;
      
      console.log('User logged in successfully (in-memory):', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        requestData: {
          email: req.body.email,
          passwordProvided: !!req.body.password,
          headers: req.headers['user-agent']
        }
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: "1d",
      });

      return res.send({
        message: "User logged in successfully (in-memory storage)",
        success: true,
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    }

    // MongoDB is available - use normal flow
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ 
        message: "User does not exist", 
        success: false 
      });
    }

    // Handle password comparison
    let isValidPassword = false;
    if (isHash(req.body.password)) {
      console.log('🔐 Password already hashed from frontend, comparing with stored hash');
      // For pre-hashed passwords, we compare the bcrypt hash of the frontend hash
      isValidPassword = await bcrypt.compare(req.body.password, user.password);
    } else {
      console.log('🔐 Password not hashed, comparing with stored hash');
      isValidPassword = await bcrypt.compare(req.body.password, user.password);
    }

    if (!isValidPassword) {
      return res.status(400).send({ 
        message: "Invalid password", 
        success: false 
      });
    }

    // Update user's last login time
    user.lastLogin = new Date();
    await user.save();
    
    console.log('User logged in successfully (MongoDB):', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      requestData: {
        email: req.body.email,
        passwordProvided: !!req.body.password,
        headers: req.headers['user-agent']
      }
    });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    let user;
    let storageType = 'unknown';
    
    if (User.db.readyState !== 1) {
      // Use in-memory storage
      storageType = 'in-memory';
      user = inMemoryUsers.find(u => u._id === req.body.userId);
    } else {
      // Use MongoDB
      storageType = 'MongoDB';
      user = await User.findById(req.body.userId).select('-password');
    }
    
    if (!user) {
      console.log(`User profile fetch failed: User not found (${storageType})`, {
        userId: req.body.userId,
        headers: req.headers['user-agent']
      });
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    
    console.log(`User profile fetched successfully (${storageType}):`, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      requestData: {
        headers: req.headers['user-agent']
      }
    });
    
    res.send({
      message: "User info fetched successfully",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// logout (client-side token removal)
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    let user;
    let storageType = 'unknown';
    
    if (User.db.readyState !== 1) {
      // Use in-memory storage
      storageType = 'in-memory';
      user = inMemoryUsers.find(u => u._id === req.body.userId);
    } else {
      // Use MongoDB
      storageType = 'MongoDB';
      user = await User.findById(req.body.userId).select('name email role');
    }
    
    console.log(`User logged out successfully (${storageType}):`, {
      userId: req.body.userId,
      user: user ? {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } : 'Unknown user',
      requestData: {
        headers: req.headers['user-agent']
      }
    });
    
    res.send({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;