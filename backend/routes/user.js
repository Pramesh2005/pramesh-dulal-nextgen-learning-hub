const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllUsers, approveUser, rejectUser, updateAvatar,updateNickname } = require('../controllers/userController');

router.get('/all', protect, admin, getAllUsers);
router.put('/approve/:id', protect, admin, approveUser);
router.put('/reject/:id', protect, admin, rejectUser);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.put('/update-nickname', protect, updateNickname);

module.exports = router;