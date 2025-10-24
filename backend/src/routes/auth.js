const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');

const router = express.Router();
const JWT_SECRET = 'seu-segredo-super-secreto-aqui';

router.post('/register', async (request, response) => {
    const { email, password } = request.body;
    const usersCollection = getDb().collection('users');

    if (!email || !password) {
        return response.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        return response.status(400).json({ error: 'Este email já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ email, password: hashedPassword });

    return response.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    const usersCollection = getDb().collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
        return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    return response.json({ token });
});

module.exports = router;