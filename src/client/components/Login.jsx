import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import { useUser } from "../contexts/UserContext";
import "../index.css";
import "./Login.css";

Modal.setAppElement("#root");

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const { userId, setUserId } = useUser();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                setUserId(data.id);
                sessionStorage.setItem("userId", userId);
                console.log("User ID:", userId);
                navigate("/calendar/");
            } else {
                setModalMessage(
                    data.message || data.error || "Unknown error occurred."
                );
                setIsOpen(true);
                // alert(data.message || data.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className="center">
            <div className="card">
                <h1>Welcome back!</h1>
                <form onSubmit={handleLogin} method="post">
                    <label htmlFor="email">E-Mail: </label>
                    <input
                        className="email-container"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="psswd">Password: </label>
                    <input
                        type="password"
                        id="psswd"
                        name="psswd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
    
                    <button type="submit" style={{display: 'none'}}></button>
                </form>
                <button onClick={handleLogin}>Login</button>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>

            {/* Alert Modal */}
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="Login Alert"
                closeTimeoutMS={100}
                style={{
                    overlay: {
                        backgroundColor: "rgba(238, 238, 238, 0.5)",
                    },
                    content: {
                        width: "420px",
                        height: "128px",
                        margin: "auto",
                        padding: "2em",
                        borderRadius: "12px",
                        textAlign: "left",
                    },
                }}>
                <h2 style={{ margin: "0", padding: "0" }}>Login Failed</h2>
                <p style={{ margin: "0", padding: "0" }}>{modalMessage}</p>
                <button
                    onClick={() => setIsOpen(false)}
                    className="modal-close-button">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Login;
