import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar, Agenda, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

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

    useFocusEffect(useCallback(() => { setLoading(true); fetchTasks(); }, []));

    const markedDates = useMemo(() => {
        const marks = {};
        tasks.forEach(task => {
            const dateString = new Date(task.start).toISOString().split('T')[0];
            if (!marks[dateString]) {
                marks[dateString] = { dots: [] };
            }
            marks[dateString].dots.push({
                key: task._id,
                color: categoryColors[task.category] || '#6b7280',
            });
        });
        return marks;
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

    const agendaItems = useMemo(() => {
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
            {loading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#3b82f6" />}
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
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
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
    }
});

export default CalendarPage;