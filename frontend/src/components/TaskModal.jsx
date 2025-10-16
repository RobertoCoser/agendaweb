import React, { useState, useEffect } from 'react';

function TaskModal({ task, isOpen, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [category, setCategory] = useState('tarefa');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (task) {
                const startDate = new Date(task.start);
                setTitle(task.title);
                setDate(startDate.toISOString().split('T')[0]);
                setStartTime(startDate.toTimeString().substring(0, 5));
                setEndTime(task.end ? new Date(task.end).toTimeString().substring(0, 5) : '');
                setCategory(task.category || 'tarefa');
                setNotes(task.notes || '');
            } else {
                setTitle('');
                setDate('');
                setStartTime('');
                setEndTime('');
                setCategory('tarefa');
                setNotes('');
            }
        }
    }, [task, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            _id: task ? task._id : null,
            title,
            date,
            startTime,
            endTime,
            category,
            notes,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{task ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="modal-task-title">Título da Tarefa</label>
                        <input id="modal-task-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-task-category">Categoria</label>
                        <select id="modal-task-category" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="tarefa">Tarefa</option>
                            <option value="reuniao">Reunião</option>
                            <option value="aniversario">Aniversário</option>
                            <option value="prova">Prova</option>
                            <option value="pessoal">Pessoal</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="modal-task-date">Data</label>
                            <input id="modal-task-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modal-task-start-time">Hora Início</label>
                            <input id="modal-task-start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modal-task-end-time">Hora Fim</label>
                            <input id="modal-task-end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-task-notes">Observações</label>
                        <textarea id="modal-task-notes" value={notes} onChange={e => setNotes(e.target.value)} rows="3"></textarea>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;