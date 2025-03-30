import "./App.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import mandarinaImg from "./assets/mandarina_ss.png";

function App() {
    const navigate = useNavigate();

    const goLogin = () => {
        navigate("/login");
    };

    return (
        <div className="front-page">
            <header className="header">
                <div className="logo">
                    <img
                        src="../public/mandarinaLogo.png"
                        alt=""
                        className="logo"
                    />
                    <h1 className="logo">Mandarina</h1>
                </div>
                <div>
                <a href="#features">Features</a>
                <a href="#how-it-works">How it works</a>
                <a href="#pricing">Something</a>
                <a href="#contact">Something else</a>
                </div>
            </header>

            <div className="hero">
                <div className="left-container">
                    <h1 className="hero">Mandarina</h1>
                    <h2 className="hero">Task Manager</h2>
                    <p>
                        Productivity,
                        <br /> Made Simple.
                    </p>
                    <button onClick={goLogin}>Get Started</button>
                </div>
                <div className="hero-image">
                    <img src={mandarinaImg} />
                </div>
            </div>

            {/* Features Section */}
            <section className="centered" id="features">
                <h2>What Makes Mandarina Special?</h2>
                <section className="features-section">
                    <div className="card-ft">
                        <h3>Integrated Calendar & Task Manager</h3>
                        <p>Plan your schedule and to-dos in one place.</p>
                    </div>
                    <div className="card-ft">
                        <h3>Minimalist & Distraction-Free</h3>
                        <p>
                            Stay focused with an intuitive design that doesn't
                            clutter your workspace.
                        </p>
                    </div>
                    <div className="card-ft">
                        <h3>Fast & Lightweight</h3>
                        <p>No unnecessary clutter, just what you need.</p>
                    </div>
                    <div className="card-ft">
                        <h3>Cross-Platform</h3>
                        <p>Works seamlessly on desktop and mobile.</p>
                    </div>
                </section>
            </section>

            <section className="centered" id="how-it-works">
                <h2>How it works?</h2>
                <section className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Create an Account</h3>
                            <p>
                                Sign up for an account and start managing your
                                tasks.
                            </p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Create your tasks and events</h3>
                            <p>Quickly add tasks and set deadlines.</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Organize & prioritize</h3>
                            <p>Just a few clicks, manage effortlessly.</p>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">4 </div>
                        <div className="step-content">
                            <h3>Stay on track</h3>
                            <p>Get reminders and track your progress.</p>
                        </div>
                    </div>
                </section>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center py-6">
                <p>&copy; 2025 Mandarina. All rights reserved.</p>
                <div className="mt-2">
                    <a href="#" className="text-orange-400 hover:underline">
                        About Us
                    </a>{" "}
                    |
                    <a href="#" className="text-orange-400 hover:underline">
                        {" "}
                        Contact
                    </a>{" "}
                    |
                    <a href="#" className="text-orange-400 hover:underline">
                        {" "}
                        FAQ
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
