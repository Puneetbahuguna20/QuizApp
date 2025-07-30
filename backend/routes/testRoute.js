const express = require('express');
const router = express.Router();

/**
 * @route GET /test
 * @desc Test endpoint to verify backend connection
 * @access Public
 */
router.get('/', (req, res) => {
  console.log('\n===== BACKEND CONNECTION TEST =====');
  console.log('Test endpoint accessed at:', new Date().toISOString());
  console.log('Request headers:', req.headers);
  console.log('Request IP:', req.ip);
  console.log('===================================\n');

  return res.status(200).json({
    status: 'success',
    message: 'Backend connection successful',
    timestamp: new Date().toISOString(),
    requestInfo: {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      path: req.path
    }
  });
});

module.exports = router;