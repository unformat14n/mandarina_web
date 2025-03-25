import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import "./Calendar.css"; // For styling

const MonthCalendar = ({ currentDate }) => {
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
            let classes = "date";
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                classes += " today";
            }
            days.push(
                <div key={day} className="day">
                    <p className={classes}>{day}</p>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-contents">
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

const DayCalendar = ({ currentDate }) => {
    // Generates an array of 24 hours in the day
    const renderHours = () => {
        const hours = [];
        for (let hour = 0; hour < 24; hour++) {
            const formattedHour =
                hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`;

            hours.push(
                <div key={hour} className="hour-row">
                    <div className="hour-label">{formattedHour}</div>
                    <div className="hour-content"></div>
                </div>
            );
        }
        return hours;
    };

    return (
        <div className="calendar-contents">
            <div className="scrollable-dates">
                <div className="calendar-hours">{renderHours()}</div>
            </div>
        </div>
    );
};

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // Default view: Month

    const handleViewChange = (event) => {
        setView(event.target.value);
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

    const renderToday = () => {
        setCurrentDate(new Date()); // Resets the current date to today's date
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>{"<"}</button>
                <h2>
                    {view === "month"
                        ? currentDate.toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                          })
                        : currentDate.toLocaleString("default", {
                              weekday: "long",
                              day: "numeric",
                          })}
                </h2>
                <button onClick={handleNextMonth}>{">"}</button>
                <button onClick={renderToday} className="simple">
                    Today
                </button>
                { view == "day" && (
                    <h3>
                        {currentDate.toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                          })}
                    </h3>
                )}
                <div className="view-selector">
                    <label htmlFor="view-select">View:</label>
                    <select
                        id="view-select"
                        value={view}
                        onChange={handleViewChange}>
                        <option value="month">Month View</option>
                        <option value="week">Week View</option>
                        <option value="day">Day View</option>
                    </select>
                </div>
                <button className="rounded-button">
                    <svg
                        data-slot="icon"
                        aria-hidden="true"
                        fill="none"
                        strokeWidth={5}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon">
                        <path
                            d="M12 4.5v15m7.5-7.5h-15"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                {/* Calendar View Content */}
                {/* <div className="calendar-contents">
                    {view === "month" && <MonthView />}
                    {view === "week" && <WeekView />}
                    {view === "day" && <DayView />}
                </div> */}
            </div>
            {/* <MonthCalendar currentDate={currentDate} /> */}
            {/* Calendar View Content */}
            <div className="calendar-contents">
                {view === "month" && (
                    <MonthCalendar currentDate={currentDate} />
                )}
                {/* {view === "week" && <WeekView />} */}
                {view === "day" && <DayCalendar currentDate={currentDate} />}
            </div>
        </div>
    );
}

export default Calendar;
