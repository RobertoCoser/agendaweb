import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';

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
        tasks.forEach(task => {
            const dateString = new Date(task.start).toISOString().split('T')[0];
            if (!marks[dateString]) {
                marks[dateString] = { dots: [] };
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
    }, [tasks]);

    const agendaItems = useMemo(() => {
        if (!Array.isArray(tasks)) return {};

        const items = {};
        tasks.forEach(task => {
            const dateString = new Date(task.start).toISOString().split('T')[0];
            if (!items[dateString]) {
                items[dateString] = [];
            }
            items[dateString].push(task);
        });
        return items;
    }, [tasks]);

    const renderItem = (item) => {
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const startTime = new Date(item.start).toLocaleTimeString('pt-BR', timeOptions);
        const hasTime = startTime !== '00:00';

        return (
            <TouchableOpacity style={styles.itemContainer}>
                <View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                </View>
                {hasTime && <Text style={styles.itemTime}>{startTime}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Agenda
                items={agendaItems}
                selected={selectedDate}
                renderItem={renderItem}
                renderEmptyDate={() => <View style={styles.emptyDate}><Text style={styles.emptyDateText}>Nenhum compromisso para este dia.</Text></View>}
                rowHasChanged={(r1, r2) => r1.title !== r2.title}
                markingType={'multi-dot'}
                markedDates={markedDates}
                onDayPress={(day) => setSelectedDate(day.dateString)}
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
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginRight: 10,
        marginTop: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
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
        height: 15,
        flex: 1,
        paddingTop: 30,
        alignItems: 'center',
    },
    emptyDateText: {
        color: '#6b7280',
        fontSize: 14,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default CalendarPage;