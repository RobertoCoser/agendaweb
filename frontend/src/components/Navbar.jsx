import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';

function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                <button className="navbar-add-btn" title="Adicionar Nova Tarefa">
                    <FaPlus /> Adicionar
                </button>
                <button onClick={handleLogout} className="logout-btn">
                    Sair
                </button>
            </div>
        </nav>
    );
}

export default Navbar;