import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function YearPicker({ date, onSelectYear }) {
    const [displayYear, setDisplayYear] = useState(date.getFullYear());

    const handlePrevYears = () => {
        setDisplayYear(prev => prev - 12);
    };

    const handleNextYears = () => {
        setDisplayYear(prev => prev + 12);
    };

    const years = [];
    for (let i = displayYear - 6; i <= displayYear + 5; i++) {
        years.push(i);
    }

    return (
        <div className="picker-container">
            <div className="picker-header">
                <button onClick={handlePrevYears} className="picker-nav-btn"><FaChevronLeft /></button>
                <span>{years[0]} - {years[years.length - 1]}</span>
                <button onClick={handleNextYears} className="picker-nav-btn"><FaChevronRight /></button>
            </div>
            <div className="picker-grid">
                {years.map((year) => (
                    <div
                        key={year}
                        className={`picker-box ${year === date.getFullYear() ? 'current' : ''}`}
                        onClick={() => onSelectYear(year)}
                    >
                        {year}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YearPicker;