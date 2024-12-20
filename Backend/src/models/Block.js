const mongoose = require("mongoose");

const blockSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nome do bloco
    description: { type: String }, // Descrição do bloco
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task", // Referência para o modelo de tarefa
      },
    ], // Lista de tarefas dentro do bloco
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referência para o modelo de usuário
      },
    ], // Amigos que têm acesso ao bloco
    collaboratorAvatars: {
      type: String, // Este campo armazenará a URL da imagem do avatar
    },
    deadline: { type: Date }, // Meta para o bloco inteiro
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Dono do bloco
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Block", blockSchema);
