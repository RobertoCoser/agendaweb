import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [category, setCategory] = useState('tarefa');
    const [notes, setNotes] = useState('');

    const formatDateToDisplay = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatDateToSave = (displayDate) => {
        if (!displayDate) return '';
        const [day, month, year] = displayDate.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }
        if (cleaned.length > 4) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        }
        setDate(formatted);
    };

    useEffect(() => {
        if (isOpen) {
            if (task) {
                const startDate = new Date(task.start);
                setTitle(task.title);
                setDate(formatDateToDisplay(startDate.toISOString().split('T')[0]));
                setStartTime(startDate.toTimeString().substring(0, 5));
                setEndTime(task.end ? new Date(task.end).toTimeString().substring(0, 5) : '');
                setCategory(task.category || 'tarefa');
                setNotes(task.notes || '');
            } else {
                setTitle('');
                const today = new Date().toISOString().split('T')[0];
                setDate(formatDateToDisplay(today));
                setStartTime('');
                setEndTime('');
                setCategory('tarefa');
                setNotes('');
            }
        }
    }, [task, isOpen]);

    const handleSave = () => {
        const isoDate = formatDateToSave(date);
        onSave({ _id: task?._id, title, date: isoDate, startTime, endTime, category, notes });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                        <Text style={styles.label}>Categoria</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
                                <Picker.Item label="Tarefa" value="tarefa" style={styles.pickerItem} />
                                <Picker.Item label="Reunião" value="reuniao" style={styles.pickerItem} />
                                <Picker.Item label="Aniversário" value="aniversario" style={styles.pickerItem} />
                                <Picker.Item label="Prova" value="prova" style={styles.pickerItem} />
                                <Picker.Item label="Pessoal" value="pessoal" style={styles.pickerItem} />
                            </Picker>
                        </View>

                        <Text style={styles.label}>Data</Text>
                        <TextInput
                            style={styles.input}
                            value={date}
                            onChangeText={handleDateChange}
                            placeholder="DD/MM/AAAA"
                            keyboardType="numeric"
                            maxLength={10}
                        />

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Hora Início</Text>
                                <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="HH:MM" />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Hora Fim</Text>
                                <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="HH:MM" />
                            </View>
                        </View>

                        <Text style={styles.label}>Observações</Text>
                        <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', maxHeight: '90%', backgroundColor: 'white', borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1f2937' },
    label: { fontSize: 14, color: '#6b7280', marginBottom: 5, marginTop: 10, fontWeight: '500' },
    input: { height: 45, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f9fafb', fontSize: 16, color: '#1f2937' },
    pickerContainer: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, backgroundColor: '#f9fafb', height: 45, justifyContent: 'center' },
    picker: { color: '#1f2937' },
    pickerItem: { fontSize: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    column: { flex: 1, marginRight: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 },
    button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    cancelButton: { borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'white' },
    cancelButtonText: { color: '#374151', fontWeight: '500' },
    saveButton: { backgroundColor: '#3b82f6' },
    saveButtonText: { color: 'white', fontWeight: '500' },
});

export default TaskModal;