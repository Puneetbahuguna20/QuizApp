const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    
    // Fetch user data for role-based access
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }
    
    req.body.userId = userId;
    req.body.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      message: "You are not authenticated",
      success: false,
    });
  }
}; 