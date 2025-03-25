import { useNavigate, NavLink } from "react-router-dom";
import React, { useState } from "react";

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

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

    const renderToday = () => {
        setCurrentDate(new Date()); // Resets the current date to today's date
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
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

        let today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            let classes = "mini-date";
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                classes += " mini-today";
            }
            days.push(
                <div key={day} className={classes}>
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="mini-calendar">
            <div className="mini-header">
                <h4 className="accented">
                    {currentDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </h4>
            </div>
            <div className="mini-week">
                <div className="mini-day">S</div>
                <div className="mini-day">M</div>
                <div className="mini-day">T</div>
                <div className="mini-day">W</div>
                <div className="mini-day">T</div>
                <div className="mini-day">F</div>
                <div className="mini-day">S</div>
            </div>
            <div className="mini-contents">{renderDays()}</div>
        </div>
    );
};

function Sidebar() {
    return (
        <nav id="sidebar">
            {/* <div className="sidebar-content"> */}
                <NavLink
                    to="/account"
                    className="sidebar-item"
                    activeclassname="active-link">
                    Account
                </NavLink>
                <NavLink
                    to="/calendar/monthly"
                    className="sidebar-item"
                    activeclassname="active-link">
                    {/* <span class="material-symbols-outlined">
                        calendar_month
                    </span> */}
                    Calendar
                </NavLink>
                <NavLink
                    to="/tasks"
                    className="sidebar-item"
                    activeclassname="active-link">
                    Tasks
                </NavLink>
                <NavLink
                    to="/theme"
                    className="sidebar-item"
                    activeclassname="active-link">
                    Theme
                </NavLink>
                <NavLink
                    to="/settings"
                    className="sidebar-item"
                    activeclassname="active-link">
                    Settings
                </NavLink>
                <MiniCalendar />
            {/* </div> */}
        </nav>
    );
}

export default Sidebar;
