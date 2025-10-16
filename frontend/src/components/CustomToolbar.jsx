import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');

    const viewNamesGroup = [
        { view: 'month', label: 'Mês' },
        { view: 'week', label: 'Semana' },
        { view: 'day', label: 'Dia' },
        { view: 'agenda', label: 'Agenda' },
    ];

    const monthName = toolbar.date.toLocaleString('pt-BR', { month: 'long' });
    const year = toolbar.date.getFullYear();

    return (
        <div className="rbc-toolbar">
            <div className="rbc-btn-group">
                <button type="button" onClick={goToCurrent}>Hoje</button>
                <button type="button" className="rbc-nav-btn" onClick={goToBack} title="Anterior"><FaChevronLeft /></button>
                <button type="button" className="rbc-nav-btn" onClick={goToNext} title="Próximo"><FaChevronRight /></button>
            </div>
            <div className="rbc-toolbar-label">
                <span className="month-label" onClick={toolbar.onToggleMonthView}>{monthName}</span>
                <span className="year-label" onClick={toolbar.onToggleYearView}>{year}</span>
            </div>
            <div className="rbc-btn-group">
                {viewNamesGroup.map(view => (
                    <button
                        key={view.view}
                        type="button"
                        className={toolbar.view === view.view ? 'rbc-active' : ''}
                        onClick={() => toolbar.onView(view.view)}
                    >
                        {view.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CustomToolbar;