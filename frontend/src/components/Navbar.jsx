import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

function Navbar({ onAddTaskClick }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                Yday :)
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
            </div>
        </nav>
    );
}

export default Navbar;