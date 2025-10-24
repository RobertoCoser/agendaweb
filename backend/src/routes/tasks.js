const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const authenticateToken = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (request, response) => {
    const tasksCollection = getDb().collection('tasks');
    const tasks = await tasksCollection.find({ userId: new ObjectId(request.userId) }).sort({ start: 1 }).toArray();
    return response.json(tasks);
});

router.post('/', async (request, response) => {
    const { title, date, startTime, endTime, category, notes } = request.body;
    const tasksCollection = getDb().collection('tasks');

    if (!title || !date) {
        return response.status(400).json({ error: 'Título e data são obrigatórios.' });
    }

    const start = new Date(`${date}T${startTime || '00:00:00'}`);
    const end = endTime ? new Date(`${date}T${endTime}`) : null;

    const result = await tasksCollection.insertOne({
        title, completed: false, start, end, category, notes,
        userId: new ObjectId(request.userId)
    });

    const task = await tasksCollection.findOne({ _id: result.insertedId });
    return response.status(201).json(task);
});

router.put('/:id', async (request, response) => {
    const { id } = request.params;
    const { title, date, startTime, endTime, category, notes } = request.body;
    const tasksCollection = getDb().collection('tasks');

    if (!title || !date) {
        return response.status(400).json({ error: 'Título e data são obrigatórios.' });
    }

    const start = new Date(`${date}T${startTime || '00:00:00'}`);
    const end = endTime ? new Date(`${date}T${endTime}`) : null;

    try {
        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(id), userId: new ObjectId(request.userId) },
            { $set: { title, start, end, category, notes } }
        );
        if (result.matchedCount === 0) return response.status(404).json({ error: 'Tarefa não encontrada.' });

        const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
        return response.json(updatedTask);
    } catch (err) {
        return response.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
    }
});

router.patch('/:id/complete', async (request, response) => {
    const { id } = request.params;
    const tasksCollection = getDb().collection('tasks');

    try {
        const task = await tasksCollection.findOne({ _id: new ObjectId(id), userId: new ObjectId(request.userId) });
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
        return response.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
    }
});

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const tasksCollection = getDb().collection('tasks');
    try {
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id), userId: new ObjectId(request.userId) });
        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        return response.status(204).send();
    } catch (err) {
        return response.status(500).json({ error: 'Erro ao excluir a tarefa.' });
    }
});

module.exports = router;