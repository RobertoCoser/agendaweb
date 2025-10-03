import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // O CSS que acabamos de editar

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then(response => { setTasks(response.data); })
      .catch(error => { console.error("Houve um erro ao buscar as tarefas!", error); });
  }, []);

  const handleAddTask = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/tasks', { title: newTaskTitle })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTaskTitle('');
      })
      .catch(error => { console.error("Houve um erro ao criar a tarefa!", error); });
  };

  const handleToggleComplete = (taskId) => {
    axios.patch(`http://localhost:3000/tasks/${taskId}/complete`)
      .then(response => {
        const updatedTask = response.data;
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      })
      .catch(error => { console.error("Houve um erro ao atualizar a tarefa!", error); });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3000/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => { console.error("Houve um erro ao excluir a tarefa!", error); });
  };

  return (
    // Adiciona a classe do container principal
    <div className="app-container">
      <h1>Sistema de Controle de Tarefas</h1>

      {/* Adiciona a classe do formulário */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="Digite o título da nova tarefa"
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Adiciona a classe da lista */}
      <ul className="task-list">
        {tasks.map(task => (
          // Adiciona a classe do item e a classe 'completed' condicionalmente
          <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <span>{task.title}</span>
            <div className="buttons">
              {!task.completed && (
                <button onClick={() => handleToggleComplete(task._id)} className="btn-complete">
                  Concluir
                </button>
              )}
              <button onClick={() => handleDeleteTask(task._id)} className="btn-delete">
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;