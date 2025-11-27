import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
    const hasActiveFilters = filters.text !== '' || filters.category !== 'todas' || filters.status !== 'todos';

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar por título..."
                    placeholderTextColor="#9ca3af"
                    value={filters.text}
                    onChangeText={(text) => onFilterChange('text', text)}
                />
                {filters.text.length > 0 && (
                    <TouchableOpacity onPress={() => onFilterChange('text', '')}>
                        <FontAwesome name="times-circle" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pickersRow}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={filters.category}
                        onValueChange={(itemValue) => onFilterChange('category', itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#6b7280"
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
                        dropdownIconColor="#6b7280"
                    >
                        <Picker.Item label="Todos Status" value="todos" style={styles.pickerItem} />
                        <Picker.Item label="Pendentes" value="pendente" style={styles.pickerItem} />
                        <Picker.Item label="Concluídas" value="concluido" style={styles.pickerItem} />
                    </Picker>
                </View>
            </View>

            {hasActiveFilters && (
                <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
                    <FontAwesome name="trash-o" size={14} color="#dc3545" style={{ marginRight: 6 }} />
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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        height: 45,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        height: '100%',
    },
    pickersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        height: 45,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: '#1f2937',
        backgroundColor: 'transparent',
    },
    pickerItem: {
        fontSize: 14,
    },
    clearButton: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#fef2f2',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    clearText: {
        color: '#dc3545',
        fontWeight: '600',
        fontSize: 14,
    }
});

export default FilterBar;