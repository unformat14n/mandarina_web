import React from "react";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const tasksStatusHdr = [
    { status: "Not started", count: 5, color: "#F0F4F8" },
    { status: "In Progress", count: 10, color: "#E6F7FF" },
    { status: "Completed", count: 20, color: "#E6FFED" }
];

function TrackStatus() {
    return (
        <div className="track-container">
            {tasksStatusHdr.map((item, index) => (
                <div key={index} className="track-card" style={{ backgroundColor: item.color }}>
                    <h3 className="status-text">{item.status}</h3>
                    <p className="status-count">{item.count}</p>
                </div>
            ))}
        </div>
    );
}

const weeklychart = [
    { Day: "S", completed: 10, color: "#E6FFED" },
    { Day: "M", completed: 5, color: "#E6FFED" },
    { Day: "T", completed: 6, color: "#E6FFED" },
    { Day: "W", completed: 8, color: "#E6FFED" },
    { Day: "TH", completed: 3, color: "#E6FFED" },
    { Day: "F", completed: 10, color: "#E6FFED" },
    { Day: "S", completed: 12, color: "#E6FFED" },
];

function Account() {
    return (
        <div className="container">
            <header className="dashboard-hdr">
                <img src="/mandarinaLogo.png" className="mand-logo" alt="Mandarina Logo" />
                <h1 className="dashboard-title">Dashboard</h1>
            </header>

            <TrackStatus />
            
            <div className="chart-container">
                <h2>Weekly Progress</h2>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklychart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                                formatter={(value) => [`${value} tasks`, "Completed"]}
                                labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Bar 
                                dataKey="completed"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            >
                                {weeklychart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Account;
