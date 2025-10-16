import React from 'react';

function FilterBar({ filters, onFilterChange, onClearFilters }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div className="filter-bar">
            <input
                type="text"
                name="text"
                placeholder="Buscar por título..."
                value={filters.text}
                onChange={handleInputChange}
                className="filter-input"
            />
            <select name="category" value={filters.category} onChange={handleInputChange} className="filter-select">
                <option value="todas">Todas as Categorias</option>
                <option value="tarefa">Tarefa</option>
                <option value="reuniao">Reunião</option>
                <option value="aniversario">Aniversário</option>
                <option value="prova">Prova</option>
                <option value="pessoal">Pessoal</option>
            </select>
            <select name="status" value={filters.status} onChange={handleInputChange} className="filter-select">
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendentes</option>
                <option value="concluido">Concluídas</option>
            </select>
            <button onClick={onClearFilters} className="clear-filters-btn">Limpar Filtros</button>
        </div>
    );
}

export default FilterBar;