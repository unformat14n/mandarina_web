import React from "react";
import "./Dashboard.css";
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

// no me convence esto xd pero bue
const tasksStatusHdr = [
    { status: "Not started", count: 5, color: "#F0F4F8" },
    { status: "In Progress", count: 10, color: "#E6F7FF" },
    { status: "Completed", count: 20, color: "#E6FFED" },
];

function TrackStatus() {
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
}

// agarra los colores del index.css
const weeklychart = [
    { Day: "S", completed: 10, color: "#b1e3bf" },
    { Day: "M", completed: 5, color: "#b1e3bf" },
    { Day: "T", completed: 6, color: "#b1e3bf" },
    { Day: "W", completed: 8, color: "#b1e3bf" },
    { Day: "TH", completed: 3, color: "#b1e3bf" },
    { Day: "F", completed: 10, color: "#b1e3bf" },
    { Day: "S", completed: 12, color: "#b1e3bf" },
];

const taskDueSoon = [
    {
        Date: "Apr 2",
        title: "Discrete exam",
        status: "Completed",
        priority: "Low",
    },
    {
        Date: "Apr 2",
        title: "Discrete exam",
        status: "Completed",
        priority: "high",
    },
    {
        Date: "Apr 2",
        title: "Discrete exam",
        status: "Completed",
        priority: "Medium",
    },
    {
        Date: "Apr 2",
        title: "Discrete exam, quiz, test, exam, quiz",
        status: "Completed",
        priority: "high",
    },
    {
        Date: "Apr 2",
        title: "Discrete exam",
        status: "Completed",
        priority: "high",
    },
    {
        Date: "Apr 2",
        title: "Discrete exam",
        status: "Completed",
        priority: "high",
    },
];

function ShowTasksDueSoon() {
    return (
        <div className="list-duesoon">
            <h2 className="duesoon-txt">Due Soon</h2>
            {taskDueSoon.map((task, index) => (
                <div key={index} className="task-item">
                    <p className="task-date">
                        <strong>{task.Date}</strong>
                    </p>
                    <p className="task-title">
                        {task.title.length > 30
                            ? task.title.slice(0, 30) + "..."
                            : task.title}
                    </p>
                    <p className="task-status">{task.status}</p>
                    <p
                        className={`task-priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Dashboard() {
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
                    <TrackStatus />

                    <div className="weeklyprog-container">
                        <h2>Weekly Progress</h2>
                        <div className="chart-wrapper">
                            <div className="weeklycount-container">
                                <p className="status-count">8</p>
                                <p className="count-txt">
                                    Tasks completed this week
                                </p>
                            </div>

                            <div className="weekly-graph">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklychart}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="Day"
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value} tasks`,
                                                "Completed",
                                            ]}
                                            labelFormatter={(label) =>
                                                `Day: ${label}`
                                            }
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
                    </div>
                </div>
                <ShowTasksDueSoon />
            </div>
        </div>
    );
}

export default Dashboard;
