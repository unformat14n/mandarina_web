import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import "./MonthCalendar.css"; // For styling

const MonthCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayIndex = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="empty-day"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div key={day} className="day">
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>{"<"}</button>
                <h2>
                    {currentDate.toLocaleString("default", { month: "long" })}{" "}
                    {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth}>{">"}</button>
            </div>
            <div className="calendar_day">
                <div className="day-label">DOM</div>
                <div className="day-label">MON</div>
                <div className="day-label">TUE</div>
                <div className="day-label">WED</div>
                <div className="day-label">THU</div>
                <div className="day-label">FRI</div>
                <div className="day-label">SAT</div>
            </div>
            <div className="scrollable-dates">
                <div className="calendar-grid">{renderDays()}</div>
            </div>
        </div>
    );
};

export default MonthCalendar;
