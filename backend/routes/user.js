const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getAllUsers, approveUser, rejectUser } = require('../controllers/userController');

router.get('/all', protect, admin, getAllUsers);
router.put('/approve/:id', protect, admin, approveUser);
router.put('/reject/:id', protect, admin, rejectUser);

module.exports = router;