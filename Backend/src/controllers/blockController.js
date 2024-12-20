const Block = require('../models/Block');

// Criar um novo bloco
exports.createBlock = async (req, res) => {
  const { name, description, collaborators, collaboratorAvatars, deadline } = req.body;
  const owner = req.user.id; // ID do usuário autenticado (dono)

  try {
    const block = await Block.create({
      name,
      description,
      collaborators: collaborators.filter((id) => id !== owner), // Remove o dono da lista de colaboradores
      collaboratorAvatars,
      deadline,
      owner,
    });

    res.status(201).json(block);
  } catch (error) {
    console.error("Erro ao criar bloco:", error);
    res.status(500).json({ message: "Erro ao criar bloco.", error: error.message });
  }
};

exports.getBlocks = async (req, res) => {
  const userId = req.user.id; // ID do usuário autenticado

  try {
    const blocks = await Block.find({
      $or: [
        { owner: userId }, // Blocos onde o usuário é o dono
        { collaborators: userId }, // Blocos onde o usuário é colaborador
      ],
    })
      .populate("tasks") // Preenche as tarefas
      .populate("owner", "username email profilePicture") // Preenche os dados do dono
      .populate("collaborators", "username email profilePicture"); // Preenche os dados dos colaboradores

    res.status(200).json(blocks);
  } catch (error) {
    console.error("Erro ao buscar blocos:", error);
    res.status(500).json({ message: "Erro ao buscar blocos.", error: error.message });
  }
};

// Buscar um bloco específico
exports.getBlock = async (req, res) => {
  const { blockId } = req.params;
  const userId = req.user.id;

  try {
    const block = await Block.findOne({
      _id: blockId,
      $or: [
        { owner: userId }, // Dono do bloco
        { collaborators: userId }, // Colaborador do bloco
      ],
    })
      .populate("tasks")
      .populate("owner")
      .populate("collaborators");

    if (!block) {
      return res.status(404).json({ message: "Bloco não encontrado ou você não tem acesso." });
    }

    res.status(200).json(block);
  } catch (error) {
    console.error("Erro ao buscar bloco:", error);
    res.status(500).json({ message: "Erro ao buscar bloco.", error: error.message });
  }
};


// Atualizar um bloco
exports.updateBlock = async (req, res) => {
  const { blockId } = req.params;
  const { name, description, deadline, collaborators, collaboratorAvatars } = req.body;

  try {
    const block = await Block.findByIdAndUpdate(
      blockId,
      { name, description, deadline, collaborators, collaboratorAvatars },
      { new: true }
    );

    if (!block) {
      return res.status(404).json({ message: 'Bloco não encontrado.' });
    }

    res.status(200).json({ message: 'Bloco atualizado com sucesso!', block });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar bloco.', error: error.message });
  }
};

// Deletar um bloco
exports.deleteBlock = async (req, res) => {
  const { blockId } = req.params;

  try {
    const block = await Block.findByIdAndDelete(blockId);

    if (!block) {
      return res.status(404).json({ message: 'Bloco não encontrado.' });
    }

    res.status(200).json({ message: 'Bloco deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar bloco.', error: error.message });
  }
};