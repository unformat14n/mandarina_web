import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verification, setVerification] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const { userId, setUserId } = useUser();

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:4004/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }) // FIXED: Changed 'username' to 'email'
            });

            const data = await response.json();

            if (data.success) {
                console.log("Registration successful!");
                setVerification(true); // Show the verification view
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Server error. Please try again later.");
        }
    };

    const handleVerify = async (e) => {
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
                alert(data.message || "Invalid verification code.");
            }
        } catch (error) {
            console.error("Error during email verification:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className="center">
            {verification ? (
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
                    <form onSubmit={handleVerify} method="post">
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
        </div>
    );
}

export default Register;
