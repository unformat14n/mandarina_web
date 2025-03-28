import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import "../index.css";

Modal.setAppElement("#root");

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:4004/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
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
                <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="email">E-Mail: </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <label htmlFor="psswd">Password: </label>
                    <input
                        type="password"
                        id="psswd"
                        name="psswd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
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
                <h2 style={{ margin: "0", padding: "0" }}>Login Alert</h2>
                <p style={{ margin: "0", padding: "0" }}>{modalMessage}</p>
                <button
                    style={{margin: '0'}}
                    onClick={() => setIsOpen(false)}
                    className="bg-red-500 text-white rounded">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Login;
