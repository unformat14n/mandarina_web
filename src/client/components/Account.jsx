import React, { useState, useEffect } from "react";
import "./Account.css";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import Modal from "react-modal";

export function Checkbox() {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="checkbox-container">
            <input
                type="checkbox"
                className="the-checkbox"
                checked={isChecked}
                onChange={handleChange}
            />
        </div>
    );
}

function Account() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { userId } = useUser();
    const { theme, toggleTheme, clrPalette, setPalette } = useTheme();

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch("/request-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setEmail(data.user.email);
                    localStorage.setItem("userEmail", data.user.email);
                    setPassword(data.user.password);
                } else {
                    console.error(
                        "Error fetching user:",
                        data.error || "Unknown error"
                    );
                }
            } catch (error) {
                console.error("Error in getUser:", error);
                setErrorMessage("Failed to fetch user data. Please try again.");
            }
        };

        if (userId) {
            // Only fetch if userId exists
            getUser();
        } else {
            console.error("No userId available to fetch user data");
        }
    }, [userId]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("theme");
            localStorage.removeItem("palette");
            window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleEdit = async (e) => {
        if (e) e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;g
        }

        try {
            const response = await fetch("/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || `Server error: ${response.status}`
                );
            }

            if (data.success) {
                console.log("Password reset successful");
                setIsOpen(false);
                setNewPassword("");
                setConfirmPassword("");
                setErrorMessage("");
                setErrorMessage("Password reset successfully!");
                setTimeout(() => setErrorMessage(""), 15000);
            } else {
                setErrorMessage(
                    dataerror ||
                        "Failed to reset password. Please try again. (0)"
                );
            }
        } catch (error) {
            console.error("Error in password reset:", error);
            setErrorMessage(error.message || "Password reset failed (1)");
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    };

    const renderUserInfo = () => {
        return (
            <div className="info-display">
                <p>Email:</p>
                <p className="user-data">{email}</p>
                <hr className="divisor" />
                <p>Password:</p>
                <p className="user-data">******</p>
                <button onClick={() => setIsOpen(true)}>Edit</button>
                {/* Modify error message display to handle success state */}
                {!isOpen && errorMessage && (
                    <p
                        style={{
                            color: errorMessage.includes("successfully")
                                ? "green"
                                : "red",
                            fontWeight: 500,
                        }}>
                        {errorMessage}
                    </p>
                )}
                <Modal
                    isOpen={isOpen}
                    contentLabel="Reset Password"
                    closeTimeoutMS={100}
                    style={{
                        content: {
                            width: "250px",
                            height: "210px",
                            margin: "auto",
                            padding: "2em",
                            borderRadius: "10px",
                            textAlign: "left",
                            overflowY: "hidden",
                            backgroundColor: "var(--bg)",
                        },
                    }}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="new-password">
                            Enter new password:{" "}
                        </label>
                        <div
                            className="input-pssw"
                            style={{
                                display: "flex",
                                flexDirection: "Column",
                                borderRadius: "12px",
                            }}>
                            <input
                                style={{
                                    backgroundColor: "var(--bg--secondary)",
                                    borderRadius: "10px",
                                    padding: "3px",
                                    border: "1px solid var(--primary)",
                                    marginBottom: "10px",
                                }}
                                type="password"
                                id="new-password"
                                name="new-password-unique"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label htmlFor="confirm-password">
                                Confirm new password:{" "}
                            </label>
                            <input
                                style={{
                                    backgroundColor: "var(--bg--secondary)",
                                    borderRadius: "10px",
                                    padding: "3px",
                                    border: "1px solid var(--primary)",
                                }}
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                        {errorMessage && (
                            <p style={{ color: "red", marginBottom: "1px" }}>
                                {errorMessage}
                            </p>
                        )}{" "}
                        {/* Display error message */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                            <button
                                onClick={handleEdit}
                                style={{ borderRadius: "15px" }}>
                                Confirm
                            </button>
                            <button
                                onClick={handleCancel}
                                style={{ borderRadius: "15px" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    };

    const renderPalettePreview = (paletteName) => {
        const colors = [];
        const paletteClrs = ['var(--primary)', 'var(--secondary)', 'var(--alt-primary)', 'var(--alt-secondary)']
        for (let i=0; i<4; i++) {
            colors.push(<div key={i} 
                className={paletteName}
                style={{
                width: "50px",
                height: "50px",
                backgroundColor: paletteClrs[i],
                border: "1px solid var(--fg)",
                boxShadow: "0 0 5px var(--primary)",
                borderRadius: "5px",
            }} />);
        }
        return (
            <div className="palette-preview">
                {colors}
            </div>
        );
    }

    return (
        <div className="container">
            <header className="account-hdr">
                <img src="/mandarinaLogo.png" className="mand-logo" />
                <h1 className="account">Account</h1>
                <button
                    style={{
                        alignSelf: "flex-end",
                        justifyContent: "flex-end",
                        marginLeft: "auto",
                        marginRight: "1em",
                    }}
                    onClick={handleLogout}>
                    Log out
                </button>
            </header>

            <div className="info-container">
                <h2 className="box-title">Personal Information</h2>
                {renderUserInfo()}
            </div>

            <div className="pref-container">
                <h2 className="box-title">Preferences</h2>
                <div className="pref-display">
                    <p>Appearance</p>
                    <button onClick={toggleTheme}>
                        Switch to {theme === "light" ? "Dark" : "Light"} Theme
                    </button>
                    <hr className="divisor" />
                    <p>Palette</p>
                    <div className="palettes-container">
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="mandarina"
                                checked={clrPalette === "mandarina"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Mandarina
                            <div>{renderPalettePreview("mandarina")}</div>
                        </label>
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="peach"
                                checked={clrPalette === "peach"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Peach Dreams
                            <div>{renderPalettePreview("peach")}</div>
                        </label>
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="coffee"
                                checked={clrPalette === "coffee"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Coffee Espresso
                            <div>{renderPalettePreview("coffee")}</div>
                        </label>
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="olive"
                                checked={clrPalette === "olive"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Olive Garden
                            <div>{renderPalettePreview("olive")}</div>
                        </label>
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="blueberry"
                                checked={clrPalette === "blueberry"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Blueberry Sparks
                            <div>{renderPalettePreview("blueberry")}</div>
                        </label>
                        <label className="palette">
                            <input
                                type="radio"
                                name="palette"
                                value="grape"
                                checked={clrPalette === "grape"}
                                onChange={(e) => setPalette(e.target.value)}
                            />
                            Grape Fusion
                            <div>{renderPalettePreview("grape")}</div>
                        </label>
                    </div>
                </div>
                {/* <ColorPalettes /> */}
            </div>
        </div>
    );
}

export default Account;
