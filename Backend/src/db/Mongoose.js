// mongoose.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clientOptions = { 
  serverApi: { 
    version: '1', 
    strict: true, 
    deprecationErrors: true 
  } 
};

async function run() {
  try {
    // Conectar ao MongoDB com as opções definidas
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });  // Verificar se o banco está acessível
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

run().catch(console.dir);
