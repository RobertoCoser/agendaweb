const { MongoClient } = require('mongodb');

const connectionString = 'mongodb://localhost:27017';
const client = new MongoClient(connectionString);

let db;

const connectToDatabase = async () => {
    try {
        await client.connect();
        db = client.db('gerenciador_tarefas');
        console.log('✅ Conectado ao MongoDB!');
    } catch (err) {
        console.error('❌ Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};

const getDb = () => db;

module.exports = { connectToDatabase, getDb };