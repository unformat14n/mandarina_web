import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MonthCalendar from './components/MonthCalendar';
import MainPage from './components/MainPage';
// import Calendar from '../pages/Calendar';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calendar/monthly" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
