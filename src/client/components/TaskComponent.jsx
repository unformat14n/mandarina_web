import React from "react";
import "./TaskComponent.css";

function Task({
    name, 
    date,
    hour,
    priority,
}) {
    return (
        <div className={`task task-${priority.toLocaleLowerCase()}`}>
            <h3 className="task-name">{name}</h3>
            <p className="task-date">{new Date(date).toISOString().split("T")[0]}</p>
            <p className="task-hour">{hour}</p>
        </div>
    )
}

export default Task;