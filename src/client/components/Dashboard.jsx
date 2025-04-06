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

        check.setDate(check.getDate() - check.getDay());
        ref.setDate(ref.getDate() - ref.getDay());

        check.setHours(0, 0, 0, 0);
        ref.setHours(0, 0, 0, 0);

        return check.getTime() === ref.getTime();
    };

    const getWeeklyChart = () => {
        const updateTasks = async () => {
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

        updateTasks();

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            let todayTasks = tasks.filter((task) => {
                const completed = new Date(task.completionDate);
                return (
                    completed.getDate() === currentDate.getDate() &&
                    completed.getMonth() === currentDate.getMonth() &&
                    completed.getFullYear() === currentDate.getFullYear()
                );
            });
            weeklychart[i].completed = todayTasks.length;
        }

        return weeklychart;
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
                                {weeklychart.map((entry, index) => (
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
            { status: "Pending", count: 0, color: "var(--primary)" },
            { status: "In Progress", count: 0, color: "var(--alt-secondary)" },
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
                        style={{ backgroundColor: item.color }}>
                        <h3 className="status-text">{item.status}</h3>
                        <p className="status-count">{item.count}</p>
                    </div>
                ))}
            </div>
        );
    };

    const showTasksDueSoon = () => {
        const taskDueSoon = [];

        const getTasks = async () => {
            try {
                const response = await fetch("/get-tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: userId }),
                });

                const data = await response.json();
                console.log(data.tasks); // Log the tasks array to the conso
                if (data.success) {
                    setTasks(data.tasks);
                } else {
                    console.error("Error fetching tasks:", data.error);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        getTasks();

        tasks.forEach((task) => {
            const taskDate = new Date(task.dueDate);
            const today = new Date();

            if (isDateInWeek(taskDate, today) && task.status !== "Completed") {
                taskDueSoon.push(task);
            }
        });

        return (
            <div className="list-duesoon">
                <h2 className="duesoon-txt">Due Soon</h2>
                {taskDueSoon.length == 0 ? (
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
