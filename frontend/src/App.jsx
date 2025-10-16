import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import CalendarView from './components/CalendarView';
import TaskList from './components/TaskList';
import Navbar from './components/Navbar';
import TaskModal from './components/TaskModal';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [filters, setFilters] = useState({ text: '', category: 'todas', status: 'todos' });

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    axios.get('http://localhost:3333/tasks')
      .then(response => { setTasks(response.data); })
      .catch(error => { console.error("Houve um erro ao buscar as tarefas!", error); });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({ text: '', category: 'todas', status: 'todos' });
  };

  const filteredTasks = tasks.filter(task => {
    const textMatch = task.title.toLowerCase().includes(filters.text.toLowerCase());
    const categoryMatch = filters.category === 'todas' || task.category === filters.category;
    const statusMatch = filters.status === 'todos' ||
      (filters.status === 'pendente' && !task.completed) ||
      (filters.status === 'concluido' && task.completed);
    return textMatch && categoryMatch && statusMatch;
  });

  const handleOpenModalForAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    const isEditing = !!taskData._id;
    const promise = isEditing
      ? axios.put(`http://localhost:3333/tasks/${taskData._id}`, taskData)
      : axios.post('http://localhost:3333/tasks', taskData);

    promise.then(response => {
      if (isEditing) {
        setTasks(tasks.map(t => (t._id === taskData._id ? response.data : t)));
        setNotification('Tarefa atualizada com sucesso!');
      } else {
        setTasks([...tasks, response.data].sort((a, b) => new Date(a.start) - new Date(b.start)));
        setNotification('Tarefa adicionada com sucesso!');
      }
      handleCloseModal();
    }).catch(error => console.error("Erro ao salvar a tarefa!", error));
  };

  const handleToggleComplete = (taskId) => {
    axios.patch(`http://localhost:3333/tasks/${taskId}/complete`)
      .then(response => {
        setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
      })
      .catch(error => { console.error("Houve um erro ao atualizar a tarefa!", error); });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3333/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== taskId));
        setNotification('Tarefa excluída com sucesso!');
      })
      .catch(error => { console.error("Houve um erro ao excluir a tarefa!", error); });
  };

  return (
    <BrowserRouter>
      <Navbar
        onAddTaskClick={handleOpenModalForAdd}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Notification message={notification} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CalendarView tasks={tasks} onSelectTask={handleOpenModalForEdit} />} />
          <Route path="/tasks" element={
            <TaskList
              tasks={filteredTasks}
              onEdit={handleOpenModalForEdit}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          } />
        </Routes>
      </main>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </BrowserRouter>
  );
}

export default App;