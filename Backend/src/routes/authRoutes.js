const express = require('express');
const { registerUser, loginUser, updateUserProfile, uploadProfilePicture, getUserData } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { upload }= require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile-picture', protect, upload, uploadProfilePicture); // Rota para criar imagem
router.put('/update', protect, upload, updateUserProfile); // Rota para atualizar perfil
router.get('/user', protect, getUserData);

module.exports = router;
