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
const EditModalContext = createContext(null);

function MainPage({ type }) {
    const [isOpen, setIsOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDate, setTaskDate] = useState("");
    const [taskHour, setTaskHour] = useState("");
    const [priority, setPriority] = useState("high");
    const { userId, setUserId } = useUser();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editInfo, setEditInfo] = useState({});

    const handlePriorityChange = (e) => {
        if (isOpen) {
            console.log("Priority changed to:", e.target.value);
            setPriority(
                e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            );
            console.log("Priority changed to:", priority);
        }
    };

    setUserId(
        userId == 0 || userId == undefined
            ? sessionStorage.getItem("userId")
            : userId
    );

    const updateTask = async () => {
        if (editInfo.title === "" || !editInfo.dueDate) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Split taskHour to get hours and minutes
            const [hours, minutes] = editInfo.hour.split(":");

            // Parse taskDate into a Date object (local time)
            const localDate = new Date(editInfo.dueDate);

            // Create a UTC date object with the same year, month, day but with UTC time
            const combinedDate = new Date(
                Date.UTC(
                    localDate.getUTCFullYear(), // Use UTC year
                    localDate.getUTCMonth(), // Use UTC month
                    localDate.getUTCDate(), // Use UTC date
                    parseInt(hours), // Use the provided hour in UTC
                    parseInt(minutes), // Use the provided minutes in UTC
                    0, // Set seconds to 0
                    0 // Set milliseconds to 0
                )
            );

            // Format the date in UTC as MySQL expects: 'YYYY-MM-DD HH:MM:SS'
            const formattedDate = combinedDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'

            const response = await fetch("/update-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editInfo.title,
                    description: editInfo.description || "", // Handle empty description
                    dueDate: formattedDate, // Send the formatted UTC date
                    priority: editInfo.priority || "Medium", // Default if missing
                    status: editInfo.status || "Pending", // Default if missing
                    taskId: editInfo.id, // Make sure this is included
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsEditOpen(false);
                setEditInfo({});
            } else {
                alert("Failed to update task: " + result.message);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch("/delete-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId: taskId }),
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Error deleting task. Please try again.");
        }
    };

    const saveTask = async () => {
        if (!taskName || !taskDate || !taskHour || !priority) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Split taskHour to get hours and minutes
            const [hours, minutes] = taskHour.split(":");

            // Parse taskDate into a Date object (local time)
            const localDate = new Date(taskDate);

            // Create a UTC date object with the same year, month, day but with UTC time
            const combinedDate = new Date(
                Date.UTC(
                    localDate.getUTCFullYear(), // Use UTC year
                    localDate.getUTCMonth(), // Use UTC month
                    localDate.getUTCDate(), // Use UTC date
                    parseInt(hours), // Use the provided hour in UTC
                    parseInt(minutes), // Use the provided minutes in UTC
                    0, // Set seconds to 0
                    0 // Set milliseconds to 0
                )
            );

            // Format the date in UTC as MySQL expects: 'YYYY-MM-DD HH:MM:SS'
            const formattedDate = combinedDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'

            // Send the task data with the UTC date and time
            const response = await fetch("/create-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: taskName,
                    description: taskDescription,
                    dueDate: formattedDate, // Send the UTC date and time
                    status: "PENDING",
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
                setPriority("high");
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
            <EditModalContext.Provider
                value={{ isEditOpen, setIsEditOpen, setEditInfo }}>
                <ModalContext.Provider value={{ isOpen, setIsOpen }}>
                    {/* New Task Modal */}

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        contentLabel="New Task"
                        className={"infront"}
                        closeTimeoutMS={100}
                        style={{
                            overlay: {
                                backgroundColor: "var(--bg-modals)",
                                zIndex: 1000,
                            },
                            content: {
                                top: "50%",
                                left: "50%",
                                right: "auto",
                                height: "auto",
                                boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.1)",
                            },
                        }}>
                        <h2 style={{ margin: "0", padding: "0" }}>New Task</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveTask();
                            }}>
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
                                style={{ resize: "none" }}
                                id="task-content"
                                name="task-content"
                                rows="4"
                                cols="53"
                                value={taskDescription}
                                onChange={(e) =>
                                    setTaskDescription(e.target.value)
                                }
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
                                <label htmlFor="priority-select">
                                    Priority:
                                </label>
                                <select
                                    style={{
                                        borderRadius: "5px",
                                        marginLeft: "10px",
                                    }}
                                    id="priority-select"
                                    value={priority}
                                    onChange={handlePriorityChange}>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                        </form>
                        <div
                            className="buttons"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "20px",
                            }}>
                            <button onClick={saveTask}>Create</button>
                            <button onClick={() => setIsOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </Modal>

                    {/* Edit Modal */}

                    <Modal
                        isOpen={isEditOpen}
                        onRequestClose={() => setIsEditOpen(false)}
                        contentLabel="Edit Task"
                        className={"infront"}
                        closeTimeoutMS={100}
                        style={{
                            overlay: {
                                backgroundColor: "var(--",
                                zIndex: 1000,
                            },
                        }}>
                        <h2 style={{ margin: "0", padding: "0" }}>Edit Task</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateTask();
                            }}>
                            <label htmlFor="task-name">Task Title:</label>
                            <input
                                type="text"
                                id="task-name"
                                name="task-name"
                                value={editInfo.title || ""}
                                onChange={(e) =>
                                    setEditInfo({
                                        ...editInfo,
                                        title: e.target.value,
                                    })
                                }
                                className="input-box"
                            />

                            <label htmlFor="task-content">Description:</label>
                            <textarea
                                style={{
                                    resize: "none",
                                }}
                                id="task-content"
                                name="task-content"
                                rows="4"
                                cols="53"
                                value={editInfo.description || ""}
                                onChange={(e) =>
                                    setEditInfo({
                                        ...editInfo,
                                        description: e.target.value,
                                    })
                                }
                                className="input-box"
                            />

                            <label htmlFor="task-date">Due Date:</label>
                            <input
                                type="date"
                                id="task-date"
                                name="task-date"
                                value={editInfo.dueDate || ""}
                                onChange={(e) =>
                                    setEditInfo({
                                        ...editInfo,
                                        dueDate: e.target.value,
                                    })
                                }
                                className="input-box"
                            />

                            <label htmlFor="task-hour">Time due:</label>
                            <input
                                type="time"
                                id="task-hour"
                                name="task-hour"
                                value={editInfo.hour || "08:00"}
                                onChange={(e) => {
                                    setEditInfo({
                                        ...editInfo,
                                        hour: e.target.value,
                                    });
                                }}
                                className="input-box"
                            />

                            <div className="priority-selector">
                                <label htmlFor="priority-select">
                                    Priority:
                                </label>
                                <select
                                    style={{
                                        borderRadius: "5px",
                                        marginLeft: "10px",
                                    }}
                                    id="priority-select"
                                    value={
                                        editInfo.priority?.toLowerCase() ||
                                        "medium"
                                    }
                                    onChange={(e) =>
                                        setEditInfo({
                                            ...editInfo,
                                            priority:
                                                e.target.value
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                e.target.value.slice(1),
                                        })
                                    }>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </form>
                        <div
                            className="buttons"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                            }}>
                            <button
                                style={{
                                    marginBlock: "0.5em",
                                    marginInline: "0.5em",
                                }}
                                onClick={updateTask}>
                                Save
                            </button>
                            <button
                                style={{
                                    marginBlock: "0.5em",
                                    marginInline: "0.5em",
                                    background: "var(--alt-primary)",
                                }}
                                onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </button>
                            <button
                                style={{
                                    marginBlock: "0.5em",
                                    marginInline: "0.5em",
                                    background: "#de3163",
                                }}
                                onClick={() => {
                                    setIsEditOpen(false);
                                    handleDelete(editInfo.id);
                                }}>
                                Delete
                            </button>
                        </div>
                    </Modal>

                    <Sidebar />
                    {type === "calendar" && <Calendar />}
                    {type === "account" && <Account />}
                    {type === "tasks" && <Tasks />}
                    {type === "dashboard" && <Dashboard />}
                </ModalContext.Provider>
            </EditModalContext.Provider>
        </section>
    );
}

export { ModalContext, EditModalContext };
export default MainPage;
