import React from "react";
import "./TaskComponent.css";

function TaskListItem({ name, date, hour, priority, status, description }) {
    return (
        <div className="task-li">
            <h3 className="task-name-li">{name}</h3>
            <p className="task-date-li">{new Date(date).toISOString().split("T")[0]}</p>
            <p className="task-hour-li">{hour}</p>
            <p className="task-description-li">{description}</p>
            <p className={`task-priority-li task-${priority.toLocaleLowerCase()}-li`}>{priority}</p>
            <p className="task-status-li">{status}</p>
        </div>
    );
}

function Task({ name, date, hour, priority }) {
    return (
        <div className={`task task-${priority.toLocaleLowerCase()}`}>
            <h3 className="task-name">{name}</h3>
            <p className="task-date">
                {new Date(date).toISOString().split("T")[0]}
            </p>
            <p className="task-hour">{hour}</p>
        </div>
    );
}

export { TaskListItem };
export default Task;
