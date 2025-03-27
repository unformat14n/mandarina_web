import React, { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { Filter } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import from Recharts
import "./Tasks.css";

const mockData = [
    {name: "Completed", value: 60},
    {name: "Pending", value: 40}
];

function Tasks() {
    return (
        /* Tasks header*/

        <div className="task-container">
            <header className="task-header">
                <div className="header-section">
                    <label className="header-label">Sort by:</label>
                    <select className="sort-select">
                        <option>Name</option>
                        <option>Date</option>
                        <option>Priority</option>
                    </select>
                </div>

                <div className="header-section">
                    <label className="header-filter">Filter by </label>
                    <button className="filter-btn">
                        <Filter
                            size={20}
                            strokeWidth={2}
                            fill="none"
                        />
                        </button>
                </div>
            </header>
                {/* <label>Sort by: </label>
                <select className="option-box">
                    <option>Name</option>
                    <option>Date</option>
                    <option>Priority</option>
                </select>
                <button className="filter-btn">
                    <Filter
                        size= {20}
                        strokeWidth={2}
                        fill="none">
                    </Filter>
                </button>
                <label>Filter by </label>
            </header> */}

            {/*Body*/}

            <div className="task-body">
                <div className="task-list">
                    <h3 className="task-title">Hola</h3>
                    <p className="task-date">0000</p>
                    <p className="task=priority">Important</p>
                    <p className="task-status">Completed</p>
            {/*Pie chart*/}

                
                </div>
            <div className="task-chart">
                <p>Task Status</p>
                <ul>
                    <li>Completed: 60%</li>
                    <li>Pending: 40%</li>
                </ul>
                <PieChart width={300} height={300}>
                    <Pie
                        data={mockData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {mockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#00C49F" : "#FF8042"} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
            </div>

        </div>
       
    );
}

export default Tasks;