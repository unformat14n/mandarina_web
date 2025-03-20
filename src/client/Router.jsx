import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import App from './App'
// import Calendar from '../pages/Calendar';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/app" element={<App />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
