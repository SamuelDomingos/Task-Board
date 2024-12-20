const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

const addFriend = async (req, res) => {
  const { friendId } = req.body; // Alterado para friendId
  try {
    const sender = await User.findById(req.user._id);
    const recipient = await User.findById(friendId); // Usando friendId aqui

    if (!recipient) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se já existe uma solicitação pendente ou amizade
    const existingRequest = await FriendRequest.findOne({
      sender: sender.id,
      recipient: recipient.id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Solicitação já enviada.' });
    }

    if (recipient.friends.includes(sender.id)) {
      return res.status(400).json({ message: 'Vocês já são amigos.' });
    }

    // Cria a solicitação
    const friendRequest = await FriendRequest.create({
      sender: sender.id,
      recipient: recipient.id,
      status: 'pending',
    });

    res.status(200).json({ message: 'Solicitação de amizade enviada.', friendRequest });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar solicitação.', error });
  }
};

// Responder à solicitação de amizade
const respondToFriendRequest = async (req, res) => {
  const { requestId, action } = req.body; // `action` pode ser 'accepted' ou 'rejected'

  try {
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest || friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Solicitação inválida ou já respondida.' });
    }

    const sender = await User.findById(friendRequest.sender);
    const recipient = await User.findById(friendRequest.recipient);

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (action === 'accepted') {
      // Atualiza status e adiciona como amigos
      friendRequest.status = 'accepted';
      recipient.friends.push(sender.id);
      sender.friends.push(recipient.id);
    } else if (action === 'rejected') {
      friendRequest.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Ação inválida.' });
    }

    await friendRequest.save();
    await sender.save();
    await recipient.save();

    res.status(200).json({ message: `Solicitação ${action}.` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao responder solicitação.', error });
  }
};

const getFriendsAndRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username profilePicture'); // Popula informações dos amigos

    // Buscar solicitações de amizade recebidas
    const receivedRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: 'pending',
    }).populate('sender', 'username profilePicture');

    // Buscar solicitações de amizade enviadas
    const sentRequests = await FriendRequest.find({
      sender: req.user.id,
      status: 'pending',
    }).populate('recipient', 'username profilePicture');

    res.status(200).json({
      friends: user.friends || [],
      receivedRequests: receivedRequests.map((request) => ({
        id: request._id,
        sender: request.sender,
        createdAt: request.createdAt,
      })),
      sentRequests: sentRequests.map((request) => ({
        id: request._id,
        recipient: request.recipient,
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error('Erro ao listar amigos e solicitações:', error);
    res.status(500).json({
      message: 'Erro ao listar amigos e solicitações.',
      error: error.message || error,
    });
  }
};

const searchUsers = async (req, res) => {
  const { term } = req.query;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: term, $options: 'i' } },
        { fullName: { $regex: term, $options: 'i' } },
      ],
      _id: { $ne: req.user.id }, // Exclui o ID do usuário atual
    }).select('username profilePicture fullName');

    const currentUser = await User.findById(req.user.id).populate('friends');

    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const isFriend = currentUser.friends.some(
          (friend) => friend._id.toString() === user._id.toString()
        );
        const hasSentRequest = await FriendRequest.findOne({
          sender: req.user.id,
          recipient: user._id,
          status: 'pending',
        });

        return {
          ...user.toObject(),
          status: isFriend
            ? 'friend'
            : hasSentRequest
            ? 'request_sent'
            : 'not_friend',
        };
      })
    );

    res.status(200).json({ users: usersWithStatus });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.', error });
  }
};


module.exports = { addFriend, respondToFriendRequest, getFriendsAndRequests, searchUsers};
