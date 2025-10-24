import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';
import timelyLogo from '../assets/TimelyLogo.png';

function Navbar({ onAddTaskClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img src={timelyLogo} alt="Timely Logo" className="navbar-logo" />
      </NavLink>
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
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;