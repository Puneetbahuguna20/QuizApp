const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Import test route for connection verification
const testRoute = require('./routes/testRoute');

// Test endpoint to verify connection
app.use('/test', testRoute);

// Try to connect to database but don't fail if not available
try {
  const dbConfig = require("./config/dbConfig");
} catch (error) {
  console.log("Database connection not available, but server will continue...");
}

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

// Auth routes (matching frontend expectations)
app.use("/auth", usersRoute);

// API routes
app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

const port = process.env.PORT || 3001;

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client" , "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
} 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});