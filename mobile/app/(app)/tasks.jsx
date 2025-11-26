import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import TaskModal from '../../components/TaskModal';
import Notification from '../../components/Notification';
import FilterBar from '../../components/FilterBar';

const categoryIcons = {
    aniversario: <FontAwesome name="birthday-cake" size={20} color="#3b82f6" />,
    reuniao: <FontAwesome name="users" size={20} color="#3b82f6" />,
    prova: <FontAwesome name="book" size={20} color="#3b82f6" />,
    pessoal: <FontAwesome name="user" size={20} color="#3b82f6" />,
    tarefa: <FontAwesome name="check-square-o" size={20} color="#3b82f6" />,
};

const TaskItem = ({ item, onEdit, onDelete, onToggle }) => {
    const formatTaskTime = (task) => {
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const startDate = new Date(task.start);
        const dateString = startDate.toLocaleDateString('pt-BR');
        if (!task.end) {
            const startTimeString = startDate.toLocaleTimeString('pt-BR', timeOptions);
            return startTimeString !== '00:00' ? `${dateString} às ${startTimeString}` : dateString;
        }
        const endDate = new Date(task.end);
        const startTimeString = startDate.toLocaleTimeString('pt-BR', timeOptions);
        const endTimeString = endDate.toLocaleTimeString('pt-BR', timeOptions);
        return `${dateString} das ${startTimeString} às ${endTimeString}`;
    };

    return (
        <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
            <View style={styles.taskInfo}>
                <TouchableOpacity style={styles.checkbox} onPress={() => onToggle(item._id)}>
                    {item.completed && <View style={styles.checkboxChecked} />}
                </TouchableOpacity>
                <View style={styles.taskDetails}>
                    <View style={styles.titleContainer}>
                        {categoryIcons[item.category] || categoryIcons.tarefa}
                        <Text style={styles.taskTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.taskTime}>{formatTaskTime(item)}</Text>
                    {item.notes && <Text style={styles.taskNotes}>{item.notes}</Text>}
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => onEdit(item)}>
                    <FontAwesome name="pencil" size={20} color="#facc15" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => onDelete(item._id)}>
                    <FontAwesome name="trash" size={20} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [notification, setNotification] = useState('');

    const [filters, setFilters] = useState({ text: '', category: 'todas', status: 'todos' });

    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (params.openModal === 'true') {
            handleOpenAddModal();
            router.setParams({ openModal: 'false' });
        }
    }, [params]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            setTasks([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchTasks(); }, []));

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => { setNotification(''); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const getFilteredTasks = () => {
        if (!Array.isArray(tasks)) return [];

        return tasks.filter(task => {
            const textMatch = task.title.toLowerCase().includes(filters.text.toLowerCase());
            const categoryMatch = filters.category === 'todas' || task.category === filters.category;
            const statusMatch = filters.status === 'todos' ||
                (filters.status === 'pendente' && !task.completed) ||
                (filters.status === 'concluido' && task.completed);
            return textMatch && categoryMatch && statusMatch;
        });
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ text: '', category: 'todas', status: 'todos' });
    };

    const onRefresh = useCallback(() => { setRefreshing(true); fetchTasks(); }, []);

    const handleOpenAddModal = () => { setEditingTask(null); setIsModalOpen(true); };
    const handleOpenEditModal = (task) => { setEditingTask(task); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingTask(null); };

    const handleSaveTask = async (taskData) => {
        const isEditing = !!taskData._id;
        const promise = isEditing
            ? axios.put(`/tasks/${taskData._id}`, taskData)
            : axios.post('/tasks', taskData);

        try {
            await promise;
            handleCloseModal();
            fetchTasks();
            setNotification(isEditing ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a tarefa.");
        }
    };

    const handleToggleComplete = async (taskId) => {
        try {
            const response = await axios.patch(`/tasks/${taskId}/complete`);
            setTasks(currentTasks => currentTasks.map(task => task._id === taskId ? response.data : task));
        } catch (error) {
            Alert.alert("Erro", "Não foi possível alterar o status da tarefa.");
        }
    };

    const handleDeleteTask = (taskId) => {
        Alert.alert(
            "Excluir Tarefa",
            "Você tem certeza que deseja excluir esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir", style: "destructive", onPress: async () => {
                        try {
                            await axios.delete(`/tasks/${taskId}`);
                            setTasks(currentTasks => currentTasks.filter(task => task._id !== taskId));
                            setNotification('Tarefa excluída com sucesso!');
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
                        }
                    }
                },
            ]
        );
    };

    if (loading && !refreshing) {
        return <ActivityIndicator style={styles.loader} size="large" color="#3b82f6" />;
    }

    const filteredData = getFilteredTasks();

    return (
        <>
            <Notification message={notification} />
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />
            <FlatList
                data={filteredData}
                renderItem={({ item }) => <TaskItem item={item} onEdit={handleOpenEditModal} onDelete={handleDeleteTask} onToggle={handleToggleComplete} />}
                keyExtractor={(item) => item._id}
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />}
            />
            <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} task={editingTask} />
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6f7' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    taskItem: { backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    taskItemCompleted: { backgroundColor: '#f0fdf4', opacity: 0.7 },
    taskInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    checkboxChecked: { width: 14, height: 14, backgroundColor: '#3b82f6', borderRadius: 3 },
    taskDetails: { flex: 1 },
    titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    taskTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
    taskTime: { fontSize: 12, color: '#6b7280' },
    taskNotes: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginTop: 4 },
    buttonsContainer: { flexDirection: 'row' },
    iconButton: { padding: 8 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#6b7280' },
});

export default TasksPage;