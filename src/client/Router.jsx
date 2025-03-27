import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calendar/" element={<MainPage type="calendar"/>} />
                <Route path="/tasks/" element={<MainPage type="tasks"/>} />
                <Route path="/account/" element={<MainPage type="account"/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
