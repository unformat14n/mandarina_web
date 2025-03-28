import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Wrap protected routes with ProtectedRoute */}
                <Route 
                    path="/calendar" 
                    element={<ProtectedRoute><MainPage type="calendar" /></ProtectedRoute>} 
                />
                <Route 
                    path="/tasks" 
                    element={<ProtectedRoute><MainPage type="tasks" /></ProtectedRoute>} 
                />
                <Route 
                    path="/account" 
                    element={<ProtectedRoute><MainPage type="account" /></ProtectedRoute>} 
                />
            </Routes>
        </Router>
    );
}

export default AppRouter;
