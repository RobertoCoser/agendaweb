import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, FlatList, ScrollView } from 'react-native';
import { Agenda, Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import TaskModal from '../../components/TaskModal';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const categoryColors = {
    reuniao: '#3b82f6',
    prova: '#facc15',
    aniversario: '#f87171',
    pessoal: '#a78bfa',
    tarefa: '#34d399',
};

const CalendarPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchTasks();
        }, [])
    );

    const markedDates = useMemo(() => {
        if (!Array.isArray(tasks)) return {};
        const marks = {};

        // Marca a data selecionada
        marks[selectedDate] = { selected: true, selectedColor: '#3b82f6' };

        tasks.forEach(task => {
            const dateString = new Date(task.start).toISOString().split('T')[0];
            if (!marks[dateString]) {
                marks[dateString] = { dots: [] };
            }
            if (!marks[dateString].dots) {
                marks[dateString].dots = []; // Garante que existe o array se já foi marcado como selected
            }

            const exists = marks[dateString].dots.find(d => d.key === task._id);
            if (!exists) {
                marks[dateString].dots.push({
                    key: task._id,
                    color: categoryColors[task.category] || '#6b7280',
                });
            }
        });
        return marks;
    }, [tasks, selectedDate]);

    const agendaItems = useMemo(() => {
        if (!Array.isArray(tasks)) return {};
        const items = {};
        tasks.forEach(task => {
            const dateString = new Date(task.start).toISOString().split('T')[0];
            if (!items[dateString]) items[dateString] = [];
            items[dateString].push(task);
        });
        if (!items[selectedDate]) items[selectedDate] = [];
        return items;
    }, [tasks, selectedDate]);

    // Filtra tarefas do dia selecionado para a visualização Web
    const selectedDayTasks = useMemo(() => {
        if (!Array.isArray(tasks)) return [];
        return tasks.filter(task => new Date(task.start).toISOString().split('T')[0] === selectedDate);
    }, [tasks, selectedDate]);

    const handleOpenEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleSaveTask = async (taskData) => {
        try {
            await axios.put(`/tasks/${taskData._id}`, taskData);
            handleCloseModal();
            fetchTasks();
        } catch (error) {
            alert("Erro ao salvar tarefa");
        }
    };

    const renderItem = (item) => {
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const startTime = new Date(item.start).toLocaleTimeString('pt-BR', timeOptions);
        const hasTime = startTime !== '00:00';

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenEditModal(item)}>
                <View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                </View>
                {hasTime && <Text style={styles.itemTime}>{startTime}</Text>}
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={styles.emptyDateText}>Nenhum compromisso para este dia.</Text>
            </View>
        );
    };

    if (loading && tasks.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    // --- RENDERIZAÇÃO WEB (Calendar + List) ---
    if (Platform.OS === 'web') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.webContainer}>
                        <Calendar
                            current={selectedDate}
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markingType={'multi-dot'}
                            markedDates={markedDates}
                            theme={{
                                todayTextColor: '#facc15',
                                selectedDayBackgroundColor: '#3b82f6',
                                arrowColor: '#3b82f6',
                            }}
                        />
                        <Text style={styles.webSectionTitle}>Agenda do dia {new Date(selectedDate).toLocaleDateString('pt-BR')}</Text>
                        {selectedDayTasks.length > 0 ? (
                            selectedDayTasks.map(item => (
                                <View key={item._id} style={{ marginBottom: 10 }}>
                                    {renderItem(item)}
                                </View>
                            ))
                        ) : (
                            renderEmptyDate()
                        )}
                    </View>
                </ScrollView>
                <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} task={editingTask} />
            </SafeAreaView>
        );
    }

    // --- RENDERIZAÇÃO MOBILE (Agenda) ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <Agenda
                key={loading ? 'loading' : 'loaded'}
                items={agendaItems}
                selected={selectedDate}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                renderEmptyData={renderEmptyDate}
                rowHasChanged={(r1, r2) => r1.title !== r2.title}
                markingType={'multi-dot'}
                markedDates={markedDates}
                onDayPress={(day) => { setSelectedDate(day.dateString); }}
                loadItemsForMonth={() => { }}
                theme={{
                    backgroundColor: '#f5f6f7',
                    calendarBackground: '#ffffff',
                    agendaDayTextColor: '#3b82f6',
                    agendaDayNumColor: '#3b82f6',
                    agendaTodayColor: '#facc15',
                    agendaKnobColor: '#3b82f6',
                    selectedDayBackgroundColor: '#3b82f6',
                    dotColor: '#3b82f6',
                }}
            />
            <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} task={editingTask} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f6f7',
    },
    webContainer: {
        padding: 20,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    webSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginRight: Platform.OS === 'web' ? 0 : 10, // Ajuste para web
        marginTop: Platform.OS === 'web' ? 0 : 17, // Ajuste para web
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderWidth: Platform.OS === 'web' ? 1 : 0,
        borderColor: '#e5e7eb'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    itemNotes: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    itemTime: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    emptyDate: {
        height: 50,
        flex: 1,
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyDateText: {
        color: '#6b7280',
        fontSize: 14,
    },
    loaderContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default CalendarPage;