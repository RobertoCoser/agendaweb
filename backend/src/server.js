const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { connectToDatabase, getDb } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

const seedAdminUser = async () => {
    const usersCollection = getDb().collection('users');
    const tasksCollection = getDb().collection('tasks');
    const adminEmail = 'admin@admin.com';

    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const adminUser = await usersCollection.insertOne({
            email: adminEmail,
            password: hashedPassword,
        });
        console.log('🌱 Usuário admin padrão criado com sucesso!');

        const adminId = adminUser.insertedId;

        const tasksToInsert = [
            { title: "Reunião Semanal de Alinhamento", category: "reuniao", notes: "Discutir progresso do Projeto Phoenix.", start: new Date("2025-10-27T09:00:00"), end: new Date("2025-10-27T10:30:00"), completed: false, userId: adminId },
            { title: "Brainstorm para novo App", category: "reuniao", notes: "Sessão de ideias com a equipe de design.", start: new Date("2025-10-29T14:00:00"), end: new Date("2025-10-29T15:00:00"), completed: false, userId: adminId },
            { title: "Prova de Cálculo II", category: "prova", notes: "Estudar capítulos 5 e 6. Levar calculadora.", start: new Date("2025-11-05T19:00:00"), end: new Date("2025-11-05T21:00:00"), completed: false, userId: adminId },
            { title: "Apresentação de Projeto Final", category: "prova", notes: "Ensaiar a apresentação com o grupo.", start: new Date("2025-11-12T10:00:00"), end: null, completed: false, userId: adminId },
            { title: "Aniversário da Amanda", category: "aniversario", notes: "Comprar presente e enviar mensagem.", start: new Date("2025-11-23T00:00:00"), end: null, completed: false, userId: adminId },
            { title: "Aniversário do Roberto", category: "aniversario", notes: "Lembrar de ligar para os pais.", start: new Date("2025-12-16T00:00:00"), end: null, completed: false, userId: adminId },
            { title: "Entregar relatório mensal", category: "tarefa", notes: "Coletar dados de vendas e marketing.", start: new Date("2025-10-31T17:00:00"), end: null, completed: true, userId: adminId },
            { title: "Levar o carro para revisão", category: "tarefa", notes: "Agendado na oficina 'Auto Certa'.", start: new Date("2025-11-03T08:30:00"), end: null, completed: false, userId: adminId },
            { title: "Consulta médica - Dr. Silva", category: "pessoal", notes: "Check-up anual.", start: new Date("2025-11-10T11:00:00"), end: new Date("2025-11-10T11:45:00"), completed: false, userId: adminId },
            { title: "Comprar ingressos para o cinema", category: "pessoal", notes: "Verificar estreia do filme 'Interestelar 2'.", start: new Date("2025-10-28T20:00:00"), end: null, completed: false, userId: adminId },
            { title: "Pagar conta de luz", category: "tarefa", notes: "Vencimento dia 10.", start: new Date("2025-11-10T00:00:00"), end: null, completed: false, userId: adminId }
        ];

        await tasksCollection.insertMany(tasksToInsert);
        console.log('🌱 Tarefas de exemplo inseridas para o usuário admin.');

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