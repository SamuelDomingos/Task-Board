const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
const blockRoutes = require('./routes/blockRoutes');
const friendRoutes = require('./routes/friendRoutes');

require('./db/Mongoose'); // Importando o arquivo de conexão com MongoDB

// Carregar variáveis do arquivo .env
dotenv.config();

// Criando o aplicativo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumenta o limite de JSON para 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Para dados URL-encoded

// Configuração para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api', authRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/friends', friendRoutes);

const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Definir porta do servidor
const PORT = process.env.PORT || 3000; // Adiciona um valor padrão para evitar erros

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
