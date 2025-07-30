const router = require("express").Router();
const Exam = require("../models/examModel");
const Report = require("../models/reportModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new quiz (teachers only)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.body.user.role !== 'teacher') {
      return res.status(403).send({
        message: "Only teachers can create quizzes",
        success: false,
      });
    }

    const newQuiz = new Exam({
      ...req.body,
      createdBy: req.body.userId,
    });

    await newQuiz.save();

    res.status(201).send({
      message: "Quiz created successfully",
      success: true,
      quiz: newQuiz,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all quizzes (for students - only active ones)
router.get("/quizzes", authMiddleware, async (req, res) => {
  try {
    let quizzes;
    
    if (req.body.user.role === 'teacher') {
      // Teachers see all their quizzes
      quizzes = await Exam.find({ createdBy: req.body.userId })
        .sort({ createdAt: -1 });
    } else {
      // Students see only active quizzes
      quizzes = await Exam.find({ status: 'active' })
        .sort({ createdAt: -1 });
    }

    res.send({
      message: "Quizzes fetched successfully",
      success: true,
      quizzes: quizzes,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get quiz by ID
router.get("/quiz/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Exam.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).send({
        message: "Quiz not found",
        success: false,
      });
    }

    // Students can only access active quizzes
    if (req.body.user.role === 'student' && quiz.status !== 'active') {
      return res.status(403).send({
        message: "Quiz is not available",
        success: false,
      });
    }

    res.send({
      message: "Quiz fetched successfully",
      success: true,
      quiz: quiz,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Submit quiz attempt (students only)
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    // Check if user is a student
    if (req.body.user.role !== 'student') {
      return res.status(403).send({
        message: "Only students can submit quiz attempts",
        success: false,
      });
    }

    const { quizId, answers, timeTaken } = req.body;

    // Get the quiz
    const quiz = await Exam.findById(quizId);
    if (!quiz) {
      return res.status(404).send({
        message: "Quiz not found",
        success: false,
      });
    }

    // Check if quiz is active
    if (quiz.status !== 'active') {
      return res.status(403).send({
        message: "Quiz is not available",
        success: false,
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Create report
    const report = new Report({
      quizId: quizId,
      studentId: req.body.userId,
      studentName: req.body.user.name,
      answers: answers,
      score: score,
      passed: passed,
      timeTaken: timeTaken,
    });

    await report.save();

    // Update quiz statistics
    const allReports = await Report.find({ quizId: quizId });
    const totalAttempts = allReports.length;
    const averageScore = allReports.length > 0 
      ? Math.round(allReports.reduce((sum, r) => sum + r.score, 0) / allReports.length)
      : 0;

    await Exam.findByIdAndUpdate(quizId, {
      attempts: totalAttempts,
      averageScore: averageScore,
    });

    res.status(201).send({
      message: "Quiz submitted successfully",
      success: true,
      report: report,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get student's quiz history
router.get("/my-attempts", authMiddleware, async (req, res) => {
  try {
    // Check if user is a student
    if (req.body.user.role !== 'student') {
      return res.status(403).send({
        message: "Only students can view their attempts",
        success: false,
      });
    }

    const attempts = await Report.find({ studentId: req.body.userId })
      .populate('quizId')
      .sort({ completedAt: -1 });

    res.send({
      message: "Quiz history fetched successfully",
      success: true,
      attempts: attempts,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router; 