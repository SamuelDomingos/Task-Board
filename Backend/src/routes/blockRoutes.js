const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');
const taskController = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware'); // Middleware para autenticação

// Rotas de Blocos
router.post('/', protect, blockController.createBlock); // Criar um bloco
router.get('/', protect, blockController.getBlocks); // Buscar todos os blocos do usuário
router.get('/:blockId', protect, blockController.getBlock); // Buscar um bloco específico
router.put('/:blockId', protect, blockController.updateBlock); // Atualizar um bloco
router.delete('/:blockId', protect, blockController.deleteBlock); // Deletar um bloco

// Rotas de Tarefas
router.post('/:blockId/tasks', protect, taskController.createTask); // Criar uma tarefa em um bloco
router.get('/:blockId/tasks', protect, taskController.getTasks); // Buscar todas as tarefas de um bloco específico
router.put('/:blockId/tasks/:taskId', protect, taskController.updateTask); // Atualizar uma tarefa
router.delete('/:blockId/tasks/:taskId', protect, taskController.deleteTask); // Deletar uma tarefa

module.exports = router;