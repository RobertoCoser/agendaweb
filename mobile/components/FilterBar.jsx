import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
    return (
        <View style={styles.container}>
            {/* Barra de Busca */}
            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={16} color="#6b7280" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar por título..."
                    placeholderTextColor="#9ca3af"
                    value={filters.text}
                    onChangeText={(text) => onFilterChange('text', text)}
                />
            </View>

            {/* Linha de Seletores */}
            <View style={styles.pickersRow}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={filters.category}
                        onValueChange={(itemValue) => onFilterChange('category', itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Todas Categ." value="todas" style={styles.pickerItem} />
                        <Picker.Item label="Tarefa" value="tarefa" style={styles.pickerItem} />
                        <Picker.Item label="Reunião" value="reuniao" style={styles.pickerItem} />
                        <Picker.Item label="Aniversário" value="aniversario" style={styles.pickerItem} />
                        <Picker.Item label="Prova" value="prova" style={styles.pickerItem} />
                        <Picker.Item label="Pessoal" value="pessoal" style={styles.pickerItem} />
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={filters.status}
                        onValueChange={(itemValue) => onFilterChange('status', itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Todos Status" value="todos" style={styles.pickerItem} />
                        <Picker.Item label="Pendentes" value="pendente" style={styles.pickerItem} />
                        <Picker.Item label="Concluídas" value="concluido" style={styles.pickerItem} />
                    </Picker>
                </View>
            </View>

            {/* Botão Limpar */}
            {(filters.text !== '' || filters.category !== 'todas' || filters.status !== 'todos') && (
                <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
                    <Text style={styles.clearText}>Limpar Filtros</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    pickersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        height: 45,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: '#1f2937',
    },
    pickerItem: {
        fontSize: 14,
    },
    clearButton: {
        marginTop: 10,
        alignItems: 'center',
        padding: 5,
    },
    clearText: {
        color: '#3b82f6',
        fontWeight: '500',
        fontSize: 14,
    }
});

export default FilterBar;