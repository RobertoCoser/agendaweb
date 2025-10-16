import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaSun, FaMoon } from 'react-icons/fa';

function Navbar({ onAddTaskClick, theme, toggleTheme }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                Agenda de Compromissos
            </div>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Calendário
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Lista de Tarefas
                </NavLink>
            </div>
            <div className="navbar-actions">
                <button onClick={onAddTaskClick} className="navbar-add-btn" title="Adicionar Nova Tarefa">
                    <FaPlus /> Adicionar
                </button>
                <button onClick={toggleTheme} className="theme-toggle-btn" title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}>
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;