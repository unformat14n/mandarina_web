import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useContext } from "react";
import "./Calendar.css"; // For styling
import { ModalContext } from "./MainPage";
import Task from "./TaskComponent";
import { useUser } from "../contexts/UserContext";

const MonthCalendar = ({ currentDate, userId, tasks }) => {
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

            // Filter tasks for the current day
            const tasksForDay = tasks.filter((task) => {
                const taskDate = new Date(task.dueDate);
                return (
                    taskDate.getDate() === day &&
                    taskDate.getMonth() === month &&
                    taskDate.getFullYear() === year
                );
            });

            // Create task components
            const taskComps = tasksForDay.map((task) => (
                // <p key={task.id} className="task">{task.title}</p>
                <Task
                    key={task.id}
                    name={task.title}
                    date={task.dueDate}
                    hour={`${task.hour}:${String(task.minute).padStart(
                        2,
                        "0"
                    )}`}
                    priority={task.priority}
                />
            ));

            days.push(
                <div key={day} className="day">
                    <p className={classes}>{day}</p>
                    {taskComps}
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

const DayCalendar = ({ currentDate, userId, tasks }) => {
    // Generates an array of 24 hours in the day
    const renderHours = () => {
        const hours = [];
        let day = new Date(currentDate);
        for (let hour = 0; hour < 24; hour++) {
            const formattedHour =
                hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`;

            const tasksForDay = tasks.filter((task) => {
                const taskDate = new Date(task.dueDate);
                return (
                    taskDate.getDate() === day.getDate() &&
                    task.hour === hour &&
                    taskDate.getMonth() === day.getMonth() &&
                    taskDate.getFullYear() === day.getFullYear()
                );
            });

            // Create task components
            const taskComps = tasksForDay.map((task) => (
                // <p key={task.id} className="task">{task.title}</p>
                <Task
                    key={task.id}
                    name={task.title}
                    date={task.dueDate}
                    hour={`${task.hour}:${String(task.minute).padStart(
                        2,
                        "0"
                    )}`}
                    priority={task.priority}
                />
            ));

            hours.push(
                <div key={hour} className="hour-row">
                    <div className="hour-label">{formattedHour}</div>
                    <div className="hour-content">{taskComps}</div>
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

const WeekCalendar = ({ currentDate, userId, tasks }) => {
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Get Sunday

        const today = new Date();
        const weekDays = [<div className="week-hdr">Hour</div>];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek.getTime()); // Create a new instance for each day
            day.setDate(startOfWeek.getDate() + i); // Move forward day by day
            let classes = "date";
            if (
                day.getDate() == today.getDate() &&
                day.getMonth() == today.getMonth() &&
                day.getFullYear() == today.getFullYear()
            ) {
                classes += " today";
            }

            weekDays.push(
                <div className="week-hdr">
                    <p className="date">
                        {day.toLocaleDateString("default", {
                            weekday: "short",
                        })}
                    </p>
                    <p className={classes}>{day.getDate()}</p>
                </div>
            );
        }
        return weekDays;
    };

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

            hours.push(<div className="hour-slot">{formattedHour}</div>);
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek.getTime()); // Create a new instance for each day
                day.setDate(startOfWeek.getDate() + i);
                const tasksForDay = tasks.filter((task) => {
                    const taskDate = new Date(task.dueDate);
                    return (
                        taskDate.getDate() === day.getDate() &&
                        task.hour === hour &&
                        taskDate.getMonth() === day.getMonth() &&
                        taskDate.getFullYear() === day.getFullYear()
                    );
                });

                // Create task components
                const taskComps = tasksForDay.map((task) => (
                    // <p key={task.id} className="task">{task.title}</p>
                    <Task
                        key={task.id}
                        name={task.title}
                        date={task.dueDate}
                        hour={`${task.hour}:${String(task.minute).padStart(
                            2,
                            "0"
                        )}`}
                        priority={task.priority}
                    />
                ));

                hours.push(
                    <div key={`day-${i}-hour-${hour}`} className="hour-slot">
                        {taskComps}
                    </div>
                );
            }
        }

        return hours;
    };

    return (
        <div>
            <div className="week-header">{getWeekDays()}</div>
            <div className="calendar-contents">
                <div className="week-body">{renderHours()}</div>
            </div>
        </div>
    );
};

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState("month"); // Default view: Month
    const { setIsOpen } = useContext(ModalContext);
    const { userId } = useUser();

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    const handlePrev = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (view === "month") {
                newDate.setMonth(newDate.getMonth() - 1);
            } else if (view === "week") {
                newDate.setDate(newDate.getDate() - 7);
            } else {
                newDate.setDate(newDate.getDate() - 1);
            }
            return newDate;
        });
    };

    const handleNext = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (view === "month") {
                newDate.setMonth(newDate.getMonth() + 1);
            } else if (view === "week") {
                newDate.setDate(newDate.getDate() + 7);
            } else {
                newDate.setDate(newDate.getDate() + 1);
            }
            return newDate;
        });
    };

    const renderToday = () => {
        setCurrentDate(new Date()); // Resets the current date to today's date
    };

    const createTask = () => {
        setIsOpen(true);
    };

    // const renderCalendar = () => {
    //     switch (view) {
    //         case "month":
    //             return <MonthCalendar currentDate={currentDate} userId={userId} tasks={tasks} />;
    //         case "week":
    //             return <WeekCalendar currentDate={currentDate} userId={userId} tasks={tasks} />;
    //         case "day":
    //             return <DayCalendar currentDate={currentDate} userId={userId} tasks={tasks} />;
    //         default:
    //             return null;
    //     }
    // }

    useEffect(() => {
        /**
         * Resets the current date to the same date every time the tasks are updated.
         * This is to ensure a refresh of the calendar every time a task is added or deleted.
         */
        setCurrentDate((prevDate) => new Date(prevDate));
    }, [tasks]);

    useEffect(() => {
        const getTasksInMonth = async () => {
            try {
                const response = await fetch("/get-tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setTasks(data.tasks); // Store tasks in state
                } else {
                    console.error("Error fetching tasks:", data.error);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        getTasksInMonth();
    }, [userId, tasks]);

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrev}>{"<"}</button>
                {(view == "month" || view == "week") && (
                    <h2>
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>
                )}{" "}
                {view === "day" && (
                    <h2>
                        {currentDate.toLocaleString("default", {
                            weekday: "long",
                            day: "numeric",
                        })}
                    </h2>
                )}
                <button onClick={handleNext}>{">"}</button>
                <button onClick={renderToday} className="simple">
                    Today
                </button>
                {view == "day" && (
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
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                    </select>
                </div>
                <button onClick={createTask} className="rounded-button">
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
            </div>
            <div className="calendar-contents">
                {view === "month" && (
                    <MonthCalendar
                        currentDate={currentDate}
                        userId={userId}
                        tasks={tasks}
                    />
                )}
                {view === "week" && (
                    <WeekCalendar
                        currentDate={currentDate}
                        userId={userId}
                        tasks={tasks}
                    />
                )}
                {view === "day" && (
                    <DayCalendar
                        currentDate={currentDate}
                        userId={userId}
                        tasks={tasks}
                    />
                )}
            </div>
        </div>
    );
}

export default Calendar;
