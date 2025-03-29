import { useNavigate, NavLink } from "react-router-dom";
import React, { useState, createContext } from "react";
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import Account from "./Account";
import Tasks from "./Tasks";
import "./MainPage.css";
import Modal from 'react-modal';
import { jwtDecode } from "jwt-decode";

const ModalContext = createContext(null);

function MainPage({ type }) {
    const [isOpen, setIsOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskContent, setTaskContent] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [taskHour, setTaskHour] = useState("");
    const [priority, setPriority] = useState("HIGH");

    let userId = 0;
    const token = localStorage.getItem("token");
    try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.id; // Assuming 'id' is stored in the token
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }

    const saveTask = async () => {
        if (!taskName || !taskContent || !taskDate || !taskHour || !priority) {
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
                    description: taskContent,
                    dueDate: taskDate,
                    status: "PENDING",
                    hour: parseInt(hours),
                    minute: parseInt(minutes),
                    priority: priority.toUpperCase(),
                    user_id: userId,
                }),
            });

            const result = await response.json();
            if (result.success) {
                // Clear form and close modal
                setTaskName("");
                setTaskContent("");
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

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    contentLabel="New Task"
                    closeTimeoutMS={100}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(238, 238, 238, 0.5)",
                        },
                        content: {
                            // position: "sticky",
                            zIndex: "1000",
                            width: "420px",
                            height: "420px",
                            margin: "auto",
                            padding: "2em",
                            borderRadius: "12px",
                            textAlign: "left",
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
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="task-content">Description:</label>
                        <textarea
                            id="task-content"
                            name="task-content"
                            rows="4"
                            cols="53"
                            value={taskContent}
                            onChange={(e) => setTaskContent(e.target.value)}
                            style={{ resize: "none" }}
                        />
                        <label htmlFor="task-date">Due Date:</label>
                        <input
                            type="date"
                            id="task-date"
                            name="task-date"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="task-hour">Time due:</label>
                        <input
                            type="time"
                            id="task-hour"
                            name="task-hour"
                            value={taskHour}
                            onChange={(e) => setTaskHour(e.target.value)}
                            style={{ width: "100%" }}
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
                    <div className="buttons">
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
