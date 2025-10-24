const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { connectToDatabase, getDb } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

const seedAdminUser = async () => {
    const usersCollection = getDb().collection('users');
    const adminEmail = 'admin@admin.com';

    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await usersCollection.insertOne({
            email: adminEmail,
            password: hashedPassword,
        });
        console.log('🌱 Usuário admin padrão criado com sucesso!');
    } else {
        console.log('👤 Usuário admin já existe.');
    }
};

app.use('/', authRoutes);
app.use('/tasks', taskRoutes);

const start = async () => {
    await connectToDatabase();
    await seedAdminUser();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
};

start();