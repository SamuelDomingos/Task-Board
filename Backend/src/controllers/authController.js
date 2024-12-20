const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const {saveBase64Image } = require('../middleware/uploadMiddleware');

// Função para validar a senha
const isValidPassword = (password) => {
  const isLongEnough = password.length >= 8;
  const hasNumbers = /\d/.test(password);
  const hasLetters = /[a-zA-Z]/.test(password);
  const isNotSequential = !/^\d+$/.test(password); // Evita somente números sequenciais

  console.log('Senha validada:', isLongEnough, hasNumbers, hasLetters, isNotSequential);  // Log de validação

  return isLongEnough && hasNumbers && hasLetters && isNotSequential;
};

// Função para validar o email (tem que ter '@gmail.com')
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

// Registrar usuário
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

    // Verifica se o email tem o domínio '@gmail.com'
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'O email deve ser um endereço válido do Gmail (exemplo: usuario@gmail.com)' });
    }

  // Validação de senha
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'A senha deve ter pelo menos 8 caracteres, conter letras e números, e não ser uma sequência simples.',
    });
  }

  try {
    // Verifica se o email já está cadastrado
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verifica se o usuario ja existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Esse nome de usuario ja existe' });
    }

    // Cria um novo usuário
    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        message: `Seja bem-vindo, ${user.username}!`,
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Dados inválidos' });
    }
  } catch (error) {
    console.error('Erro:', error); // Mostra o erro completo no console
    res.status(500).json({ message: 'Erro no servidor', error: error.message }); // Envia uma mensagem mais detalhada
  }
};

// Fazer login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validação inicial
  if (!email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica se o email existe no banco de dados
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email não registrado.' });
    }

    // Verifica se a senha está correta
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Retorna as informações do usuário e o token de autenticação
    return res.status(200).json({
      message: `Seja bem-vindo, ${user.username}!`,
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user.id), // Gerar o token JWT
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error); // Log do erro no servidor
    return res.status(500).json({
      message: 'Erro no servidor. Tente novamente mais tarde.',
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, description } = req.body;
    const userId = req.user.id;

    // Encontra o usuário pelo ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza os dados
    if (username) user.username = username;
    if (email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'O email deve ser um endereço válido do Gmail' });
      }
      user.email = email;
    }
    if (description) user.description = description;

    // Atualiza a foto de perfil, se enviada
    if (req.file) {
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: 'Perfil atualizado com sucesso.',
      user: {
        _id: user.id,
        username: user.username,
        description: user.description,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      message: 'Erro no servidor. Tente novamente mais tarde.',
      error: error.message,
    });
  }
};

// Função para upload da foto de perfil
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
// Adicione esses logs no seu middleware protect
console.log('Headers recebidos:', req.headers);
console.log('Body recebido:', req.body);

    // Verifica se o arquivo foi enviado
    if (req.file) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      
      // Salva o caminho da imagem no banco de dados
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
      await user.save();

      return res.status(201).json({
        message: 'Foto de perfil adicionada com sucesso.',
        profilePicture: user.profilePicture,
      });
    } else {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }
  } catch (error) {
    console.error('Erro ao adicionar foto de perfil:', error);
    res.status(500).json({ message: 'Erro no servidor.', error: error.message });
  }
};

// Buscar dados do usuário
const getUserData = async (req, res) => {
  try {
    // Obtém o usuário pelo ID do token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retorna os dados do usuário
    res.status(200).json({
      message: 'Dados do usuário recuperados com sucesso.',
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture, // Inclui a foto de perfil, caso tenha
        description: user.description,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error); // Log de erro
    res.status(500).json({
      message: 'Erro ao recuperar dados do usuário.',
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, uploadProfilePicture, getUserData};
