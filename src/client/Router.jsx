import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./components/Login";
import App from "./App";
import Register from "./components/Register";
import MainPage from "./components/MainPage";
import ProtectedRoute from "./ProtectedRoute";
import { useTheme } from "./contexts/ThemeContext";

function AppRouter() {
    const { theme, clrPalette } = useTheme();
    
    useEffect(() => {
        // Apply the current theme to the body class
        document.body.className = theme;
        // Apply the current palette to the body class
        document.body.classList.remove(
            "Mandarina",
            "Peach",
            "Coffee"
        );
        document.body.classList.add(clrPalette);
    }, [theme, clrPalette]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Wrap protected routes with ProtectedRoute */}
                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <MainPage type="calendar" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <MainPage type="tasks" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <MainPage type="account" />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default AppRouter;
