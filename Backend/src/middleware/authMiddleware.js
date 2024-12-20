const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extrai o token do header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token

      req.user = await User.findById(decoded.id).select('-password'); // Adiciona o usuário no request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, token não encontrado' });
  }
};

module.exports = protect;
