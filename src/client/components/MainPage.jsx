import { useNavigate, NavLink } from "react-router-dom";
import React, { useState, createContext } from "react";
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import Account from "./Account";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import "./MainPage.css";
import Modal from "react-modal";
import { useUser } from "../contexts/UserContext";

const ModalContext = createContext(null);

function MainPage({ type }) {
    const [isOpen, setIsOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [taskHour, setTaskHour] = useState("");
    const [priority, setPriority] = useState("HIGH");
    const { userId, setUserId } = useUser();

    setUserId(
        userId == 0 || userId == undefined
            ? sessionStorage.getItem("userId")
            : userId
    );

    const saveTask = async () => {
        if (!taskName || !taskDate || !taskHour || !priority) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const [hours, minutes] = taskHour.split(":");

            const response = await fetch("/create-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: taskName,
                    description: taskDescription,
                    dueDate: taskDate,
                    status: "PENDING",
                    hour: parseInt(hours),
                    minute: parseInt(minutes),
                    priority: priority.toUpperCase(),
                    userId: userId,
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Clear form and close modal
                setTaskName("");
                setTaskDescription("");
                setTaskDate("");
                setTaskHour("");
                setPriority("");
                setIsOpen(false);
            } else {
                alert("Failed to create task: " + result.message);
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Error creating task. Please try again.");
        }
    };

    return (
        <section className="main">
            <ModalContext.Provider value={{ setIsOpen }}>
                <Sidebar />
                {type === "calendar" && <Calendar />}
                {type === "account" && <Account />}
                {type === "tasks" && <Tasks />}
                {type === "dashboard" && <Dashboard />}

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    contentLabel="New Task"
                    className={"infront"}
                    closeTimeoutMS={100}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(238, 238, 238, 0.5)",
                        },
                        content: {
                            // position: "sticky",
                            top: "50%",
                            left: "50%",
                            right: "auto",
                            height: "54%",
                            boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.1)",
                        },
                    }}>
                    <h2 style={{ margin: "0", padding: "0" }}>New Task</h2>
                    <form action={(e) => e.preventDefault()}>
                        <label htmlFor="task-name">Task Title:</label>
                        <input
                            type="text"
                            id="task-name"
                            name="task-name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="input-box"
                        />
                        <label htmlFor="task-content">Description:</label>
                        <textarea
                            id="task-content"
                            name="task-content"
                            rows="4"
                            cols="53"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className="input-box"
                        />
                        <label htmlFor="task-date">Due Date:</label>
                        <input
                            type="date"
                            id="task-date"
                            name="task-date"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className="input-box"
                        />
                        <label htmlFor="task-hour">Time due:</label>
                        <input
                            type="time"
                            id="task-hour"
                            name="task-hour"
                            value={taskHour}
                            onChange={(e) => setTaskHour(e.target.value)}
                            className="input-box"
                        />
                        <div className="priority-selector">
                            <label htmlFor="priority-select">Priority:</label>
                            <select
                                id="priority-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </form>
                    <div className="buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <button
                            style={{
                                marginBlock: "0.5em",
                                marginInline: "1em",
                            }}
                            onClick={saveTask}
                            className="bg-red-500 text-white rounded">
                            Create
                        </button>
                        <button
                            style={{
                                marginBlock: "0.5em",
                                marginInline: "1em",
                                background: "var(--alt-primary)"
                            }}
                            onClick={() => setIsOpen(false)}
                            className="bg-red-500 text-white rounded">
                            Cancel
                        </button>
                    </div>
                </Modal>
            </ModalContext.Provider>
        </section>
    );
}

export { ModalContext };
export default MainPage;
