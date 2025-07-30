const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/quizapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
}).then(() => {
  console.log('Connected to MongoDB');
  seedTeacher();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Function to seed the teacher accounts
async function seedTeacher() {
  try {
    // Check if primary teacher account already exists
    const teacherEmail1 = 'teacher@123gmail.com';
    const existingTeacher1 = await User.findOne({ email: teacherEmail1 });
    
    // Check if secondary teacher account already exists
    const teacherEmail2 = 'teacher@31gmail.com';
    const existingTeacher2 = await User.findOne({ email: teacherEmail2 });
    
    // If both teacher accounts exist, exit
    if (existingTeacher1 && existingTeacher2) {
      console.log('Both teacher accounts already exist');
      process.exit(0);
    }
    
    // Create primary teacher account if it doesn't exist
    if (!existingTeacher1) {
      const hashedPassword1 = await hashPassword('teacher123');
      
      const newTeacher1 = new User({
        name: 'Teacher Admin',
        email: teacherEmail1,
        password: hashedPassword1,
        role: 'teacher',
      });
      
      await newTeacher1.save();
      console.log('Primary teacher account created successfully:', {
        id: newTeacher1._id,
        email: newTeacher1.email,
        role: newTeacher1.role
      });
    } else {
      console.log('Primary teacher account already exists:', {
        id: existingTeacher1._id,
        email: existingTeacher1.email,
        role: existingTeacher1.role
      });
    }
    
    // Create secondary teacher account if it doesn't exist
    if (!existingTeacher2) {
      const hashedPassword2 = await hashPassword('teacher31');
      
      const newTeacher2 = new User({
        name: 'Teacher Secondary',
        email: teacherEmail2,
        password: hashedPassword2,
        role: 'teacher',
      });
      
      await newTeacher2.save();
      console.log('Secondary teacher account created successfully:', {
        id: newTeacher2._id,
        email: newTeacher2.email,
        role: newTeacher2.role
      });
    } else {
      console.log('Secondary teacher account already exists:', {
        id: existingTeacher2._id,
        email: existingTeacher2.email,
        role: existingTeacher2.role
      });
    }
    
    console.log('Teacher account seeding completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teacher account:', error);
    process.exit(1);
  }
}