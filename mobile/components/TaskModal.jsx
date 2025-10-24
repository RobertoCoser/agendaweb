import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Primeiro, instale o Picker: npx expo install @react-native-picker/picker
// (Execute este comando no terminal na pasta 'mobile')

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [category, setCategory] = useState('tarefa');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (task) {
                const startDate = new Date(task.start);
                setTitle(task.title);
                setDate(startDate.toISOString().split('T')[0]);
                setStartTime(startDate.toTimeString().substring(0, 5));
                setEndTime(task.end ? new Date(task.end).toTimeString().substring(0, 5) : '');
                setCategory(task.category || 'tarefa');
                setNotes(task.notes || '');
            } else {
                setTitle('');
                const today = new Date().toISOString().split('T')[0];
                setDate(today);
                setStartTime('');
                setEndTime('');
                setCategory('tarefa');
                setNotes('');
            }
        }
    }, [task, isOpen]);

    const handleSave = () => {
        onSave({ _id: task?._id, title, date, startTime, endTime, category, notes });
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
                            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                                <Picker.Item label="Tarefa" value="tarefa" />
                                <Picker.Item label="Reunião" value="reuniao" />
                                <Picker.Item label="Aniversário" value="aniversario" />
                                <Picker.Item label="Prova" value="prova" />
                                <Picker.Item label="Pessoal" value="pessoal" />
                            </Picker>
                        </View>

                        <Text style={styles.label}>Data</Text>
                        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" />

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
                        <TextInput style={[styles.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline />

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
    modalContent: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 14, color: '#6b7280', marginBottom: 5, marginTop: 10 },
    input: { height: 45, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f5f6f7', fontSize: 16 },
    pickerContainer: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, backgroundColor: '#f5f6f7' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    column: { flex: 1, marginRight: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
    button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    cancelButton: { borderWidth: 1, borderColor: '#e5e7eb' },
    cancelButtonText: { color: '#1f2937' },
    saveButton: { backgroundColor: '#3b82f6' },
    saveButtonText: { color: 'white' },
});


export default TaskModal;