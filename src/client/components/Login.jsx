import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import '../index.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/calendar/monthly');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Server error. Please try again later.');
        }
    };

    return (
        <div className="center">
            <div className="card">
                <h1>Welcome back!</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="uname">Username: </label>
                    <input
                        type='text'
                        id='uname'
                        name="uname"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    /><br />
                    <label htmlFor="psswd">Password: </label>
                    <input
                        type='password'
                        id='psswd'
                        name="psswd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br />
                </form>
                <button onClick={handleLogin}>Login</button>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

export default Login;
