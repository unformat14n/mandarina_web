import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { TaskListItem } from "./TaskComponent";
import { useUser } from "../contexts/UserContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const { userId } = useUser();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("/get-tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: userId }),
                });

                const data = await response.json();
                if (data.success) {
                    setTasks(data.tasks);
                } else {
                    console.error("Error fetching tasks:", data.error);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [userId]); // Only fetch once when the component mounts or when userId changes

    const weeklychart = [
        { Day: "S", completed: 0, color: "var(--secondary)" },
        { Day: "M", completed: 0, color: "var(--secondary)" },
        { Day: "T", completed: 0, color: "var(--secondary)" },
        { Day: "W", completed: 0, color: "var(--secondary)" },
        { Day: "T", completed: 0, color: "var(--secondary)" },
        { Day: "F", completed: 0, color: "var(--secondary)" },
        { Day: "S", completed: 0, color: "var(--secondary)" },
    ];

    const isDateInWeek = (date, reference) => {
        const check = new Date(date);
        const ref = new Date(reference);

        // Set the date to the start of the week (Monday) in UTC
        check.setUTCDate(check.getUTCDate() - check.getUTCDay());
        ref.setUTCDate(ref.getUTCDate() - ref.getUTCDay());

        // Set the hours to 00:00:00:000 UTC
        check.setUTCHours(0, 0, 0, 0);
        ref.setUTCHours(0, 0, 0, 0);

        // Compare both dates
        return check.getTime() === ref.getTime();
    };

    const getWeeklyChart = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const updatedWeeklyChart = [...weeklychart]; // Copy the original chart data

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);

            // Normalize currentDate to UTC at 00:00:00 for consistent comparison
            const currentDateUTC = new Date(
                Date.UTC(
                    currentDate.getUTCFullYear(),
                    currentDate.getUTCMonth(),
                    currentDate.getUTCDate(),
                    0,
                    0,
                    0,
                    0
                )
            );

            let todayTasks = tasks.filter((task) => {
                const completed = new Date(task.completionDate);

                // Normalize completed date to UTC at 00:00:00 for consistent comparison
                const completedDateUTC = new Date(
                    Date.UTC(
                        completed.getUTCFullYear(),
                        completed.getUTCMonth(),
                        completed.getUTCDate(),
                        0,
                        0,
                        0,
                        0
                    )
                );

                return completedDateUTC.getTime() === currentDateUTC.getTime(); // Compare in UTC time
            });

            updatedWeeklyChart[i].completed = todayTasks.length;
        }

        return updatedWeeklyChart;
    };

    const renderWeeklyChart = () => {
        const weeklydata = getWeeklyChart();
        const tasksCompleted = weeklydata.reduce(
            (total, entry) => total + entry.completed,
            0
        );
        return (
            <div className="weeklyprog-container">
                <div className="chart-wrapper">
                    <div className="weeklycount-container">
                        <p className="status-count">{tasksCompleted}</p>
                        <p className="count-txt">Tasks completed this week</p>
                    </div>
                </div>
                <div className="weekly-graph">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklydata}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="Day"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(value) => [
                                    `${value} tasks`,
                                    "Completed",
                                ]}
                                labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Bar
                                dataKey="completed"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}>
                                {weeklydata.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderTaskStatus = () => {
        const tasksStatusHdr = [
            {
                status: "Pending",
                count: 0,
                from: "var(--primary)",
                to: "var(--alt-primary)",
            },
            {
                status: "In Progress",
                count: 0,
                from: "var(--alt-secondary)",
                to: "var(--secondary)",
            },
        ];

        tasks.forEach((task) => {
            if (task.status === "Pending") {
                tasksStatusHdr[0].count++;
            } else if (task.status === "In Progress") {
                tasksStatusHdr[1].count++;
            }
        });

        return (
            <div className="track-container">
                {tasksStatusHdr.map((item, index) => (
                    <div
                        key={index}
                        className="track-card"
                        style={{
                            background: `linear-gradient(45deg, ${tasksStatusHdr[index].from}, ${tasksStatusHdr[index].to})`,
                        }}>
                        <h3 className="status-text">{item.status}</h3>
                        <p className="status-count">{item.count}</p>
                    </div>
                ))}
            </div>
        );
    };

    const showTasksDueSoon = () => {
        const taskDueSoon = tasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            const today = new Date();
            return isDateInWeek(taskDate, today) && task.status !== "Completed";
        });

        return (
            <div className="list-duesoon">
                <h2 className="duesoon-txt">Due Soon</h2>
                {taskDueSoon.length === 0 ? (
                    <p>No Pending/In Progress tasks scheduled this week :D</p>
                ) : (
                    taskDueSoon.map((task, index) => (
                        <div key={index} className="task-item">
                            <p className="task-date">
                                <strong>
                                    {new Date(task.dueDate).toLocaleDateString(
                                        "us-en",
                                        {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )}
                                </strong>
                            </p>
                            <p className="task-title">{task.title}</p>
                            <p className="task-status">{task.status}</p>
                            <p
                                className={`task-priority ${task.priority.toLowerCase()}`}>
                                {task.priority}
                            </p>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="container">
            <header className="dashboard-hdr">
                <img
                    src="/mandarinaLogo.png"
                    className="mand-logo"
                    alt="Mandarina Logo"
                />
                <h1 className="dashboard-title">Dashboard</h1>
            </header>

            <div className="subcontainer">
                <div className="char-status-container">
                    {renderTaskStatus()}
                    <h2>Weekly Progress</h2>
                    {renderWeeklyChart()}
                </div>
                {showTasksDueSoon()}
            </div>
        </div>
    );
}

export default Dashboard;
