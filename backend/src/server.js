const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

const connectionString = 'mongodb://localhost:27017';
let tasksCollection;

async function startServer() {
    try {
        const client = await MongoClient.connect(connectionString);
        console.log('✅ Conectado ao MongoDB!');

        const db = client.db('gerenciador_tarefas');
        tasksCollection = db.collection('tasks');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
}

app.get('/tasks', async (request, response) => {
    const tasks = await tasksCollection.find({}).sort({ start: 1 }).toArray();
    return response.json(tasks);
});

app.post('/tasks', async (request, response) => {
    const { title, date, startTime, endTime, category, notes } = request.body;

    if (!title || !date) {
        return response.status(400).json({ error: 'Título e data são obrigatórios.' });
    }

    const start = new Date(`${date}T${startTime || '00:00:00'}`);
    const end = endTime ? new Date(`${date}T${endTime}`) : null;

    const result = await tasksCollection.insertOne({
        title,
        completed: false,
        start,
        end,
        category,
        notes,
    });

    const task = await tasksCollection.findOne({ _id: result.insertedId });
    return response.status(201).json(task);
});

app.patch('/tasks/:id/complete', async (request, response) => {
    const { id } = request.params;
    try {
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
        if (!task) {
            return response.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        const newCompletedStatus = !task.completed;

        await tasksCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { completed: newCompletedStatus } }
        );

        const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
        return response.json(updatedTask);
    } catch (err) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

app.delete('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        return response.status(204).send();
    } catch (err) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

app.put('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    const { title, date, startTime, endTime, category, notes } = request.body;

    if (!title || !date) {
        return response.status(400).json({ error: 'Título e data são obrigatórios.' });
    }

    const start = new Date(`${date}T${startTime || '00:00:00'}`);
    const end = endTime ? new Date(`${date}T${endTime}`) : null;

    try {
        await tasksCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, start, end, category, notes } }
        );
        const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
        return response.json(updatedTask);
    } catch (err) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

startServer();