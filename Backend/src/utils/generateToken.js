const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const generateToken = (userId) => {
  // Usa a chave secreta do arquivo .env
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Ajuste o tempo de expiração conforme necessário
};

module.exports = generateToken;
