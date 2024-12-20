const Task = require('../models/Task');
const Block = require('../models/Block');

// Criar uma nova tarefa dentro de um bloco
exports.createTask = async (req, res) => {
  const { blockId } = req.params; // ID do bloco onde a tarefa será criada
  const { title, description, icon, status, isGoal, deadline } = req.body;

  try {
    const block = await Block.findById(blockId);

    if (!block) {
      return res.status(404).json({ message: 'Bloco não encontrado.' });
    }

    const newTask = await Task.create({ title, description, icon, status, isGoal, deadline });

    block.tasks.push(newTask._id); // Adiciona a tarefa ao bloco
    await block.save();

    res.status(201).json({ message: 'Tarefa criada com sucesso!', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa.', error: error.message });
  }
};

// Buscar todas as tarefas de um bloco específico
exports.getTasks = async (req, res) => {
  const { blockId } = req.params;

  try {
    // Verifica se o bloco existe
    const block = await Block.findById(blockId).populate('tasks'); // Popula as tarefas associadas ao bloco

    if (!block) {
      return res.status(404).json({ message: 'Bloco não encontrado.' });
    }

    res.status(200).json({ message: 'Tarefas recuperadas com sucesso!', tasks: block.tasks });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas do bloco.', error: error.message });
  }
};



// Atualizar uma tarefa
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, icon, status, deadline } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, icon, status, deadline },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    res.status(200).json({ message: 'Tarefa atualizada com sucesso!', task });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.', error: error.message });
  }
};

// Deletar uma tarefa
exports.deleteTask = async (req, res) => {
  const { blockId, taskId } = req.params;

  try {
    const block = await Block.findById(blockId);

    if (!block) {
      return res.status(404).json({ message: 'Bloco não encontrado.' });
    }

    await Task.findByIdAndDelete(taskId);

    block.tasks = block.tasks.filter((id) => id.toString() !== taskId);
    await block.save();

    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar tarefa.', error: error.message });
  }
};
