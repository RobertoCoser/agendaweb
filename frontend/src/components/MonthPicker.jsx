import React from 'react';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function MonthPicker({ date, onSelectMonth }) {
    const currentMonth = date.getMonth();

    return (
        <div className="picker-container">
            {months.map((month, index) => (
                <div
                    key={month}
                    className={`picker-box ${index === currentMonth ? 'current' : ''}`}
                    onClick={() => onSelectMonth(index)}
                >
                    {month}
                </div>
            ))}
        </div>
    );
}

export default MonthPicker;