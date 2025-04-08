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
                <div className="quick-access">
                    <a href="#features" className="quickaccs">Features</a>
                    <a href="#how-it-works" className="quickaccs">How it works</a>
                    <a href="#about-us" className="quickaccs">About Us</a>
                    <a href="#contact" className="quickaccs">Something else</a>
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

            <section className="about" id="about-us">
                <div className="about-content">
                    <h2>About Us</h2>
                    <div className="who">
                        <h3>Who is "<em>Us</em>"?</h3>
                        <p>
                            We are a team of passionate college students
                            currently on our junior/sophomore year of studying
                            BS in Software Engineering at Keiser University
                            Latin American Campus, San Marcos, Nicaragua. Our
                            team is composed of 4 students: Ximena Ruiz, Jordana
                            Puentes, Osvaldo Rodriguez and Kenneth Herrera. Each
                            of us has a unique skill set and we are all driven
                            by our desire to create applications, frameworks,
                            and other tools to help others in their daily lives
                            and solve problems in a way that can be attractive
                            and at the same time, effective.
                        </p>
                    </div>
                    <div className="purpose">
                        <h3>What's Our Purpose?</h3>
                        <p>
                            Our proyect has been through a lot of iterations and
                            changes. Since the beginning, we wanted to create a
                            task manager that would help people manage their
                            time and tasks in a more efficient way, mostly
                            focusing on students–since we found ourselves in the
                            situation in which we were most affected by it.
                        </p>
                        <p>
                            We are currently living in a world in which time
                            management is a very crucial skill to have. Thus, we
                            wanted to create a tool that would help people
                            manage their time and tasks efficiently and in a
                            simplified way, while also providing an interactive
                            and user-friendly interface making the process
                            enjoyable and fun.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center py-6">
                <p>&copy; 2025 Mandarina. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
