// Importa o framework Express
const express = require('express');
// Importa o CORS para permitir requisições de outros domínios
const cors = require('cors');
// NOVO: Importa o MongoClient e o ObjectId do pacote mongodb
const { MongoClient, ObjectId } = require('mongodb');

// Inicializa a aplicação Express
const app = express();
// Define a porta em que o servidor irá rodar
const PORT = 3333;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Conexão com o MongoDB Local ---

// NOVO: Define a string de conexão para o servidor MongoDB local
const connectionString = 'mongodb://localhost:27017';

// NOVO: Variável para armazenar a referência à "collection" de tarefas
let tasksCollection;

// NOVO: Função principal para conectar ao DB e iniciar o servidor
async function startServer() {
    try {
        // Conecta ao cliente do MongoDB
        const client = await MongoClient.connect(connectionString);
        console.log('✅ Conectado ao MongoDB!');

        // Seleciona o banco de dados (se não existir, será criado na primeira inserção)
        const db = client.db('gerenciador_tarefas');
        // Seleciona a "collection" (equivalente à "tabela" em SQL)
        tasksCollection = db.collection('tasks');

        // Inicia o servidor Express APÓS a conexão com o banco ser estabelecida
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Erro ao conectar ao MongoDB:', err);
        process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
    }
}


// --- ROTAS DA APLICAÇÃO ---

/**
 * ROTA PARA LISTAR TODAS AS TAREFAS
 */
app.get('/tasks', async (request, response) => {
    // .find({}) busca todos os documentos. .toArray() converte o resultado para uma lista.
    const tasks = await tasksCollection.find({}).toArray();
    return response.json(tasks);
});

/**
 * ROTA PARA CRIAR UMA NOVA TAREFA
 */
app.post('/tasks', async (request, response) => {
    const { title } = request.body;
    // .insertOne() adiciona um novo "documento" com o título e completed: false
    const result = await tasksCollection.insertOne({ title, completed: false });
    // Busca o documento recém-criado para retorná-lo na resposta
    const task = await tasksCollection.findOne({ _id: result.insertedId });
    return response.status(201).json(task);
});

/**
 * ROTA PARA MARCAR UMA TAREFA COMO CONCLUÍDA
 */
app.patch('/tasks/:id/complete', async (request, response) => {
    const { id } = request.params;
    try {
        // .updateOne() atualiza um documento. $set define os campos a serem alterados.
        // O _id do MongoDB precisa ser convertido de string para um objeto ObjectId.
        await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: { completed: true } });
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
        return response.json(task);
    } catch (err) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

/**
 * ROTA PARA EXCLUIR UMA TAREFA
 */
app.delete('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    try {
        // .deleteOne() remove o documento que corresponde ao filtro.
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        return response.status(204).send();
    } catch (err) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

// NOVO: Chama a função para iniciar a conexão e o servidor
startServer();