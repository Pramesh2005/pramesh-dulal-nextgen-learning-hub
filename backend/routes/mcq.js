const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateMCQs } = require('../controllers/mcqController');

router.post('/generate', protect, generateMCQs);

module.exports = router;