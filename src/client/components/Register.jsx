import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verification, setVerification] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const { userId, setUserId } = useUser();
    const [isOpen, setIsOpen] = useState(false); // State for the modal alert
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // State for the loading indicator

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        
        if (password !== confirmPassword) {
            setModalMessage("Passwords do not match!");
            setIsOpen(true);
            return;
        }

        setIsLoading(true); // Show the loading indicator
        try {
            const response = await fetch("http://localhost:4004/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }) 
            });

            const data = await response.json();

            if (data.success) {
                console.log("Registration successful!");
                setVerification(true); // Show the verification view
            } else {
                setModalMessage(
                    data.message || data.error || "Unknown error occurred."
                );
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Server error. Please try again later.");
        } finally {
            setIsLoading(false); // Hide the loading indicator 
        }
    };

    const handleVerify = async (e) => {
        setIsLoading(true); // Show the loading indicator
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4004/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, code }) // Send email and code for verification
            });

            const data = await response.json();

            if (data.success) {
                alert("Email verified successfully!");
                setUserId(data.id);
                sessionStorage.setItem("userId", userId);
                navigate('/calendar'); // Navigate to the calendar page after success
            } else {
                setModalMessage(
                    data.message || data.error || "Unknown error occurred."
                );
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Error during email verification:", error);
            alert("Server error. Please try again later.");
        } finally {
            setIsLoading(false); // Hide the loading indicator 
        }
    };

    return (
        <div className="center">
           {isLoading ? (
                <div className="loading">Loading...</div> // Loading indicator
            ) : verification ? (
                <div className="card">
                    <h1>Verify Your Email</h1>
                    <p>Check your inbox, we have sent you a verification code.</p>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleVerify}>Verify Email</button>
                </div>
            ) : (
                <div className="card">
                    <h1>Create an Account</h1>
                    <form onSubmit={handleRegister} method="post">
                        <label htmlFor="email">E-Mail:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" style={{display: 'none'}}></button>
                        <br />
                        <label htmlFor="psswd">Password: </label>
                        <input
                            type="password"
                            id="psswd"
                            name="passwd"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br />
                        <label htmlFor="confirmPsswd">Confirm Password: </label>
                        <input
                            type="password"
                            id="confirmPsswd"
                            name="confirmPasswd"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        
                        <br />
                    </form>
                    <button onClick={handleRegister}>Continue</button>
                </div>
            )}
            {/* Alert Modal */}
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="Register Alert"
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
                <h2 style={{ margin: "0", padding: "0" }}>Registration Failed</h2>
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

export default Register;
