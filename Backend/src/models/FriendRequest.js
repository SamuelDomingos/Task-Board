const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quem enviou
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quem recebeu
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Status da solicitação
  },
  { timestamps: true } // Para controlar quando foi criada e atualizada
);

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
