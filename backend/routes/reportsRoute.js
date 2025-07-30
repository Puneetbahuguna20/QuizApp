const router = require("express").Router();
const Report = require("../models/reportModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all reports (for teachers)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.body.user.role !== 'teacher') {
      return res.status(403).send({
        message: "Only teachers can view all reports",
        success: false,
      });
    }

    const reports = await Report.find({})
      .populate('quizId')
      .populate('studentId', 'name email')
      .sort({ completedAt: -1 });

    res.send({
      message: "Reports fetched successfully",
      success: true,
      reports: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get reports for a specific quiz (for teachers)
router.get("/quiz/:quizId", authMiddleware, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.body.user.role !== 'teacher') {
      return res.status(403).send({
        message: "Only teachers can view quiz reports",
        success: false,
      });
    }

    const reports = await Report.find({ quizId: req.params.quizId })
      .populate('studentId', 'name email')
      .sort({ completedAt: -1 });

    res.send({
      message: "Quiz reports fetched successfully",
      success: true,
      reports: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router; 