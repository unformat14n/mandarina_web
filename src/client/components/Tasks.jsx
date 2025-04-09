import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import from Recharts
import { TaskListItem } from "./TaskComponent";
import { useUser } from "../contexts/UserContext";
import "./Tasks.css";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [taskCopy, setTaskCopy] = useState([]); // Original tasks list (unfiltered)
    const [completionData, setData] = useState([
        { name: "Completed", value: 0 },
        { name: "Pending", value: 0 },
        { name: "In Progress", value: 0 },
    ]);
    const [sortBy, setSortBy] = useState("Name");
    const [keyword, setKeyword] = useState("");

    const { userId } = useUser();

    const handleDelete = async (id) => {
        console.log("Deleting task:", id); // Log the task object for debugging
        try {
            const response = await fetch("/delete-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId: id,
                }),
            });
            const data = await response.json();

            if (data.success) {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== id)
                );

                // Recalculate the completion data based on remaining tasks
                const updatedData = [
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
                    {
                        name: "In Progress",
                        value: data.tasks.filter(
                            (task) => task.status === "In Progress"
                        ).length,
                    },
                ];
                setData(updatedData);
            } else {
                console.error("Error deleting task:", data.error);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const getTasks = async () => {
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
                setTasks(data.tasks);
                setTaskCopy(data.tasks); // Set unfiltered tasks (copy)
                updateCompletionData(data.tasks);
            } else {
                console.error("Error fetching tasks:", data.error);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const updateCompletionData = (taskList) => {
        setData([
            {
                name: "Completed",
                value: taskList.filter((task) => task.status === "Completed")
                    .length,
            },
            {
                name: "Pending",
                value: taskList.filter((task) => task.status === "Pending")
                    .length,
            },
            {
                name: "In Progress",
                value: taskList.filter((task) => task.status === "In Progress")
                    .length,
            },
        ]);
    };

    useEffect(() => {
        getTasks();
    }, [userId]);

    const renderTasks = (sortBy) => {
        let sortedTasks = [...tasks];
        if (sortBy === "Date") {
            sortedTasks.sort((a, b) => {
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return dateA - dateB;
            });
        } else if (sortBy === "Hour") {
            sortedTasks.sort((a, b) => {
                const hourA = parseInt(a.hour, 10);
                const minuteA = parseInt(a.minute, 10);
                const hourB = parseInt(b.hour, 10);
                const minuteB = parseInt(b.minute, 10);
                return hourA - hourB || minuteA - minuteB;
            });
        } else {
            sortedTasks.sort((a, b) => {
                const nameA = a.title.toLowerCase();
                const nameB = b.title.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }

        return sortedTasks.length != 0 ? (
            sortedTasks.map((task, index) => (
                <TaskListItem
                    key={index}
                    id={task.id}
                    name={task.title}
                    date={task.dueDate}
                    hour={`${task.hour}:${String(task.minute).padStart(
                        2,
                        "0"
                    )}`}
                    priority={task.priority}
                    status={task.status}
                    description={task.description}
                    onDelete={handleDelete}
                />
            ))
        ) : (
            <div className="no-tasks">
                <p>
                    No tasks found with{" "}
                    <em style={{ color: "var(--primary)", fontWeight: "bold" }}>
                        '{keyword}'
                    </em>
                </p>
            </div>
        );
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        renderTasks(sortBy, ""); // Re-render tasks after selection change
    };
    const handleKeyword = () => {
        if (keyword) {
            const filteredTasks = taskCopy.filter(
                (task) =>
                    task.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    task.description
                        .toLowerCase()
                        .includes(keyword.toLowerCase())
            );
            setTasks(filteredTasks);
        } else {
            setTasks(taskCopy); // Reset to all tasks when search is cleared
        }
    };

    return (
        /* Tasks header*/

        <div className="task-container">
            <header className="task-header">
                <label className="header-label">Sort by:</label>
                <select
                    className="sort-select"
                    id="view-select"
                    value={sortBy}
                    onChange={handleSortChange}>
                    <option>Name</option>
                    <option>Date</option>
                    <option>Hour</option>
                </select>
                <label className="header-label">Find keyword:</label>
                <input
                    className="search-input"
                    type="text"
                    id="search-input"
                    placeholder="Search..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="filter-btn" onClick={handleKeyword}>
                    <svg
                        data-slot="icon"
                        aria-hidden="true"
                        strokeWidth={2}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="smol-icon">
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </header>

            <div className="task-body">
                <div className="task-list">{renderTasks(sortBy)}</div>
                <div className="task-chart">
                    <div>
                        <p>Task Status</p>
                        <ul>
                            <li>
                                Completed:{" "}
                                {(
                                    (completionData[0].value * 100) /
                                    taskCopy.length
                                ).toFixed(0)}
                                %
                            </li>
                            <li>
                                Pending:{" "}
                                {(
                                    (completionData[1].value * 100) /
                                    taskCopy.length
                                ).toFixed(0)}
                                %
                            </li>
                            <li>
                                In Progress:{" "}
                                {(
                                    (completionData[2].value * 100) /
                                    taskCopy.length
                                ).toFixed(0)}
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
                                    fill={
                                        index === 0
                                            ? "var(--primary)"
                                            : index === 1
                                            ? "var(--alt-primary)"
                                            : "var(--secondary)"
                                    }
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
