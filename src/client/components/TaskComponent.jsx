import React, { useContext, useState } from "react";
import "./TaskComponent.css";
import { EditModalContext } from "./MainPage";

function TaskListItem({ id, name, date, hour, priority, status, description, onDelete }) {

    return (
        <div key={id} className="task-li">
            <div className="task-li-content">
                <h3 className="task-name-li">{name}</h3>
                <p className="task-date-li">
                    {new Date(date).toISOString().split("T")[0]}
                </p>
                <p className="task-hour-li">{hour}</p>
                <p className="task-description-li">{description}</p>
                <p
                    className={`task-priority-li task-${priority.toLocaleLowerCase()}-li`}>
                    {priority}
                </p>
                <p className="task-status-li">{status}</p>
            </div>
            <div className="btn-container">
                <button className="task-del" onClick={() => onDelete(id)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function Task({ id, name, date, hour, priority, curStatus, onStatusChange }) {
    const [status, setStatus] = useState(curStatus);
    const { setIsEditOpen, setEditInfo } = useContext(EditModalContext);

    const openEditModal = (taskId) => {
        getTaskInfo(taskId);
        setIsEditOpen(true);
    };
    
    const getTaskInfo = async (id) => {
        try {
            const response = await fetch('/get-task', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId: id,
                })
            });

            const data = await response.json();

            if (data.success) {
                setEditInfo({
                    ...data.taskInfo,
                   taskId: id
                });
            } else {
                console.error("Error changing status:", data.error);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        }
    }

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onStatusChange(id, newStatus); // Call handler to update status
    };

    const formatTime = (hour) => {
        const [hours, minutes] = hour.split(":");
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    return (
        <div
            className={`task task-${priority.toLocaleLowerCase()} task-${status
                .replaceAll(" ", "-")
                .toLocaleLowerCase()}`}>
            <h3 className="task-name">{name}</h3>
            <div className="task-content">
                <p className="task-hour">{formatTime(hour)}</p>
                <div className="btn-row">
                    {status != "Completed" && (
                        <button
                            className="status-btn"
                            onClick={() => handleStatusChange("Completed")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="smol-icon">
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                    {status != "Completed" && status != "In Progress" && (
                        <button
                            className="status-btn"
                            onClick={() => handleStatusChange("In Progress")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="smol-icon">
                                <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                    {status != "Completed" && (
                        <button
                            className="status-btn"
                            onClick={() => openEditModal(id)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="smol-icon">
                                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export { TaskListItem };
export default Task;
