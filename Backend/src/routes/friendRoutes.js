const express = require('express');
const { addFriend, respondToFriendRequest, getFriendsAndRequests, searchUsers } = require('../controllers/friendController');
const protect = require('../middleware/authMiddleware'); // Middleware para autenticação

const router = express.Router();

// Rotas de amizade
router.post('/request', protect, addFriend); // Enviar solicitação
router.post('/respond', protect, respondToFriendRequest); // Aceitar/rejeitar solicitação
router.get('/search', protect, searchUsers);
router.get('/', protect, getFriendsAndRequests); // Listar amigos e solicitações

module.exports = router;
