import React, { useState, useEffect } from "react";
import "./Account.css"; 

export function Checkbox() {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked);
    };
    
    return (
        <div className="checkbox-container">
            <input type="checkbox" className="the-checkbox" checked={isChecked} onChange={handleChange} />
        </div>
    );
};

const themes = [
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] },
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] },
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] },
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] },
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] },
    { name: "Peach Dreams", colors: ["#FFDAB9", "#FFA07A", "#E9967A", "#FF4500"] }
];

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
                                <div key={idx} className="color-box" style={{ backgroundColor: color }}></div>
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
            </header>

            <div className="info-container">
                <h2 className="infobox-title">Personal Information</h2>
                <div className="info-display">
                    <p>Email:</p>
                    <p className="user-data">sampleemail@gmail.com</p>
                    <hr className="divisor"/>
                    <p>Password:</p>
                    <p className="user-data">********</p>
                </div>
                <button>Edit</button>
            </div>

            <div className="pref-container">
                <h2 className="prefbox-title">Preferences</h2>
                <div className="pref-display">
                    <p>Appearance</p>
                    <hr className="divisor"/>
                    <ColorPalettes />
                </div>
            </div>
        </div>
    );
}

export default Account;
