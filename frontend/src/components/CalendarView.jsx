import React, { useEffect, useState } from 'react';
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

function CalendarView({ tasks, onSelectTask }) {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [pickerView, setPickerView] = useState('none');

  useEffect(() => {
    const formattedEvents = tasks.map(task => {
      const startDate = new Date(task.start);
      const isAllDay = startDate.getHours() === 0 && startDate.getMinutes() === 0 && !task.end;

      return {
        title: task.title,
        start: startDate,
        end: task.end ? new Date(task.end) : startDate,
        allDay: isAllDay,
        resource: task,
      };
    });
    setEvents(formattedEvents);
  }, [tasks]);

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleView = (newView) => {
    setView(newView);
    setPickerView('none');
  };

  const handleSelectEvent = (event) => {
    onSelectTask(event.resource);
  };

  const handleSelectMonth = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    setView('month');
    setPickerView('none');
  };

  const handleSelectYear = (year) => {
    const newDate = new Date(year, date.getMonth(), 1);
    setDate(newDate);
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

  const containerStyle = {
    height: pickerView === 'none' ? '65vh' : 'auto',
  };

  return (
    <div className="app-container">
      <h1>Calendário</h1>
      <div style={containerStyle}>
        {pickerView !== 'none' ? renderPicker() : (
          <Calendar
            localizer={localizer}
            events={events}
            culture='pt-BR'
            startAccessor="start"
            endAccessor="end"
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              date: "Data",
              time: "Hora",
              event: "Compromisso",
              allDay: "Dia todo",
            }}
            date={date}
            view={view}
            onNavigate={handleNavigate}
            onView={handleView}
            onSelectEvent={handleSelectEvent}
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
    </div>
  );
}

export default CalendarView;