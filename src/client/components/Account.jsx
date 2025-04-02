import React, { useState, useEffect } from "react";
import "./Account.css";
import { useTheme } from "../contexts/ThemeContext";

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

function ColorPalettes() {
    return (
        <div>
            <p>Themes</p>
            <div className="themes-grid">
                {themes.map((theme, index) => (
                    <div key={index} className="theme-item">
                        <div className="theme-hdr">
                            <Checkbox />
                            <p className="user-data">{theme.name}</p>
                        </div>
                        <div className="color-container">
                            {theme.colors.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="color-box"
                                    style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Account() {
    const [email, setEmail] = useState("");
    const { theme, toggleTheme, clrPalette, setPalette } = useTheme();

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    return (
        <div className="container">
            <header className="account-hdr">
                <img src="/mandarinaLogo.png" className="mand-logo" />
                <h1 className="account">Account</h1>
                <button className="logout-btn">Log out</button>
            </header>

            <div className="info-container">
                <h2 className="box-title">Personal Information</h2>
                <div className="info-display">
                    <p>Email:</p>
                    <p className="user-data">sampleemail@gmail.com</p>
                    <hr className="divisor" />
                    <p>Password:</p>
                    <p className="user-data">********</p>
                    <button>Edit</button>
                </div>
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
                    <div className="view-selector">
                        <label htmlFor="view-select">View:</label>
                        <select
                            id="view-select"
                            value={clrPalette}
                            onChange={(e) => setPalette(e.target.value)}>
                            <option value="mandarina">Mandarina</option>
                            <option value="peach">Peach</option>
                            <option value="coffee">Coffee</option>
                        </select>
                    </div>
                    {/* <ColorPalettes /> */}
                </div>
            </div>
        </div>
    );
}

export default Account;
