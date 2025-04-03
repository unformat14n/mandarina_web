import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import from Recharts
import { TaskListItem } from "./TaskComponent";
import { useUser } from "../contexts/UserContext";
import "./Tasks.css";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [completionData, setData] = useState([
        { name: "Completed", value: 0 },
        { name: "Pending", value: 0 },
    ]);

    const { userId } = useUser();

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
                    setData([
                        {
                            name: "Completed",
                            value: data.tasks.filter(
                                (task) => task.status === "Completed"
                            ).length,
                        },
                        {
                            name: "Pending",
                            value: data.tasks.filter(
                                (task) => task.status === "Pending"
                            ).length,
                        },
                    ]);
                } else {
                    console.error("Error fetching tasks:", data.error);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        getTasksInMonth();
    }, [userId]);

    const renderTasks = () => {
        return tasks.map((task, index) => (
            <TaskListItem
                key={index}
                id={task.id}
                name={task.title}
                date={task.dueDate}
                hour={`${task.hour}:${String(task.minute).padStart(2, "0")}`}
                priority={task.priority}
                status={task.status}
                description={task.description}
            />   
        ));
    };



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
                    <label className="header-filter">Filter by </label>
                    <button className="filter-btn">
                        {/* <Filter
                            size={20}
                            strokeWidth={2}
                            fill="none"
                        /> */}
                        <svg
                            width={24}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="white"
                            className="size-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                            />
                        </svg>
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
                <div className="task-list">{renderTasks()}</div>
                <div className="task-chart">
                    <div>
                        <p>Task Status</p>
                        <ul>
                            <li>
                                Completed:{" "}
                                {(completionData[0].value * 100) / tasks.length}
                                %
                            </li>
                            <li>
                                Pending:{" "}
                                {(completionData[1].value * 100) / tasks.length}
                                %
                            </li>
                        </ul>
                    </div>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={completionData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            fill="#8884d8"
                            label>
                            {completionData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === 0 ? "#00C49F" : "#FF8042"}
                                />
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
