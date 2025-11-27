import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';
import MonthPicker from './MonthPicker';
import YearPicker from './YearPicker';
import { FaPencilAlt, FaTrashAlt, FaBirthdayCake, FaUserFriends, FaClipboardCheck, FaBookOpen, FaUser } from 'react-icons/fa';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const categoryColors = {
  reuniao: '#3b82f6',
  prova: '#facc15',
  aniversario: '#f87171',
  pessoal: '#a78bfa',
  tarefa: '#34d399',
  default: '#6b7280'
};

const categoryIcons = {
  aniversario: <FaBirthdayCake />,
  reuniao: <FaUserFriends />,
  prova: <FaBookOpen />,
  pessoal: <FaUser />,
  tarefa: <FaClipboardCheck />,
  default: <FaClipboardCheck />,
};

function CalendarView({ tasks, onSelectTask }) {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [pickerView, setPickerView] = useState('none');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Data selecionada para a agenda

  useEffect(() => {
    const formattedEvents = tasks.map(task => {
      const startDate = new Date(task.start);
      const endDate = task.end ? new Date(task.end) : startDate;

      // Ajuste para garantir que eventos de dia inteiro ou sem hora terminem no final do dia corretamente
      // para o Big Calendar entender
      if (!task.end) {
        endDate.setHours(23, 59, 59);
      }

      return {
        title: task.title,
        start: startDate,
        end: endDate,
        resource: task,
      };
    });
    setEvents(formattedEvents);
  }, [tasks]);

  // Filtra as tarefas do dia selecionado
  const dailyTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.start);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [tasks, selectedDate]);

  const handleNavigate = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate); // Atualiza a agenda ao navegar
  };

  const handleView = (newView) => {
    setView(newView);
    setPickerView('none');
  };

  // Ao clicar em um slot (dia vazio ou horário), seleciona a data
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    // Se estiver na visão de mês, clicar num dia foca nele, mas não muda a view necessariamente.
    // Se quiser mudar para a visão de dia ao clicar, descomente a linha abaixo:
    // setView('day'); setDate(slotInfo.start);
  };

  // Ao clicar num evento, seleciona a data dele e abre edição
  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
    // Opcional: Abrir modal direto ou só selecionar? 
    // O usuário pediu para aparecer a agenda embaixo. Vamos manter o clique abrindo o modal também?
    // Se quiser SÓ mostrar na lista, remova a linha abaixo.
    // onSelectTask(event.resource); 
  };

  const handleSelectMonth = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    setSelectedDate(newDate);
    setView('month');
    setPickerView('none');
  };

  const handleSelectYear = (year) => {
    const newDate = new Date(year, date.getMonth(), 1);
    setDate(newDate);
    setSelectedDate(newDate);
    setPickerView('month');
  };

  const renderPicker = () => {
    if (pickerView === 'month') {
      return <MonthPicker date={date} onSelectMonth={handleSelectMonth} />;
    }
    if (pickerView === 'year') {
      return <YearPicker date={date} onSelectYear={handleSelectYear} />;
    }
    return null;
  };

  // Define a cor do evento
  const eventPropGetter = (event) => {
    const backgroundColor = categoryColors[event.resource.category] || categoryColors.default;
    return { style: { backgroundColor } };
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      <h1>Calendário de Compromissos</h1>

      {/* Adiciona classe 'month-view-mode' se estiver no mês para ativar o CSS de bolinhas */}
      <div style={{ height: pickerView === 'none' ? '60vh' : 'auto', marginTop: '20px' }}
        className={view === 'month' ? 'month-view-mode' : ''}>

        {pickerView !== 'none' ? renderPicker() : (
          <Calendar
            localizer={localizer}
            events={events}
            culture='pt-BR'
            startAccessor="start"
            endAccessor="end"
            messages={{
              next: "Próximo", previous: "Anterior", today: "Hoje", month: "Mês",
              week: "Semana", day: "Dia", agenda: "Agenda", date: "Data",
              time: "Hora", event: "Compromisso", allDay: "Dia todo", showMore: total => `+${total} mais`
            }}
            date={date}
            view={view}
            onNavigate={handleNavigate}
            onView={handleView}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            eventPropGetter={eventPropGetter}
            components={{
              toolbar: (toolbarProps) => (
                <CustomToolbar
                  {...toolbarProps}
                  onToggleMonthView={() => setPickerView(pickerView === 'month' ? 'none' : 'month')}
                  onToggleYearView={() => setPickerView(pickerView === 'year' ? 'none' : 'year')}
                />
              ),
            }}
          />
        )}
      </div>

      {/* --- AGENDA DIÁRIA ABAIXO DO CALENDÁRIO --- */}
      <div className="daily-agenda-section">
        <h3>Agenda do dia {selectedDate.toLocaleDateString('pt-BR')}</h3>

        {dailyTasks.length > 0 ? (
          <ul className="task-list">
            {dailyTasks.map(task => (
              <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`} onClick={() => onSelectTask(task)} style={{ cursor: 'pointer' }}>
                <div className="task-info">
                  <div className="task-details">
                    <div className="task-title-category">
                      <span className="category-icon" style={{ color: categoryColors[task.category] }}>
                        {categoryIcons[task.category] || categoryIcons.default}
                      </span>
                      <span>{task.title}</span>
                    </div>
                    <div className="task-time">
                      {formatTime(task.start)}
                      {task.end ? ` - ${formatTime(task.end)}` : ''}
                    </div>
                    {task.notes && <p className="task-notes">{task.notes}</p>}
                  </div>
                </div>
                <div className="buttons">
                  {/* Botão visual apenas, ação no clique do item */}
                  <button className="btn-edit"><FaPencilAlt /></button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tasks-message">Nenhum compromisso para este dia.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;