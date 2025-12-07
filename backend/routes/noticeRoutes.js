const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

router.post('/create', protect, createNotice);
router.get('/all', protect, getNotices);
router.put('/:id', protect, updateNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;
