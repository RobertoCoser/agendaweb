import React from 'react';
import { FaPencilAlt, FaTrashAlt, FaBirthdayCake, FaUserFriends, FaClipboardCheck, FaBookOpen, FaUser } from 'react-icons/fa';
import FilterBar from './FilterBar';

const categoryIcons = {
    aniversario: <FaBirthdayCake />,
    reuniao: <FaUserFriends />,
    prova: <FaBookOpen />,
    pessoal: <FaUser />,
    default: <FaClipboardCheck />,
};

function TaskList({ tasks, onEdit, onDelete, onToggleComplete, filters, onFilterChange, onClearFilters }) {

    const formatTaskTime = (task) => {
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const startDate = new Date(task.start);
        const dateString = startDate.toLocaleDateString('pt-BR');

        if (!task.end) {
            const startTimeString = startDate.toLocaleTimeString('pt-BR', timeOptions);
            if (startTimeString !== '00:00') {
                return `${dateString} às ${startTimeString}`;
            }
            return dateString;
        }

        const endDate = new Date(task.end);
        const startTimeString = startDate.toLocaleTimeString('pt-BR', timeOptions);
        const endTimeString = endDate.toLocaleTimeString('pt-BR', timeOptions);
        return `${dateString} das ${startTimeString} às ${endTimeString}`;
    };

    return (
        <div className="app-container">
            <div className="task-list-header">
                <h1>Lista de Tarefas</h1>
            </div>

            <FilterBar
                filters={filters}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
            />

            <ul className="task-list">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                            <div className="task-info">
                                <input
                                    type="checkbox"
                                    className="task-checkbox"
                                    checked={task.completed}
                                    onChange={() => onToggleComplete(task._id)}
                                />
                                <div className="task-details">
                                    <div className="task-title-category">
                                        <span className="category-icon">{categoryIcons[task.category] || categoryIcons.default}</span>
                                        <span>{task.title}</span>
                                    </div>
                                    <div className="task-time">{formatTaskTime(task)}</div>
                                    {task.notes && <p className="task-notes">{task.notes}</p>}
                                </div>
                            </div>
                            <div className="buttons">
                                <button onClick={() => onEdit(task)} className="btn-edit" title="Editar Tarefa">
                                    <FaPencilAlt />
                                </button>
                                <button onClick={() => onDelete(task._id)} className="btn-delete" title="Excluir Tarefa">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="no-tasks-message">Nenhuma tarefa encontrada com os filtros selecionados.</p>
                )}
            </ul>
        </div>
    );
}

export default TaskList;