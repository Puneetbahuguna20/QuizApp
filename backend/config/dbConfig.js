const mongoose = require("mongoose");

// Try to connect to MongoDB but don't crash if it fails
const connectDB = async () => {
  try {
    // Add connection options for MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };
    
    console.log("Attempting to connect to MongoDB with URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/quizapp', options);
    console.log("Mongo Db Connection Successful");
  } catch (error) {
    console.error("Mongo Db Connection Failed - Using in-memory storage", error.message);
    console.log("To use MongoDB, please install and start MongoDB or set MONGO_URL in .env");
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongo Db Connection Failed - Using in-memory storage");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongo Db Disconnected");
});

// Connect to database
connectDB();

module.exports = mongoose.connection;