import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import "../index.css";
import "./Login.css";

Modal.setAppElement("#root");

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

function PasswordToggleIcon({showPassword}) {
    return showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-medium">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-medium">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>
);

        
    };
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
                        className="email-container"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <label htmlFor="psswd">Password: </label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="psswd"
                            name="psswd"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <PasswordToggleIcon showPassword={showPassword} />
                        </button>
                    </div>
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
                    onClick={() => setIsOpen(false)}
                    className="modal-close-button">
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default Login;
