import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json();

            if (data.success) {
                alert('Registration successful! Welcome to Mandarina!');
                navigate('/app');
            } else {
                alert(data.message || 'Failed to register. Try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            console.log("uname", username);
            console.log("password", password);
            console.log(JSON.stringify({ username, password }))
            alert('Server error. Please try again later.');
        }
    };

    return (
        <div className="center">
            <div className="card">
                <h1>Create an Account</h1>
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
                        name="passwd"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br />
                    <label htmlFor="confirmPsswd">Confirm Password: </label>
                    <input
                        type='password'
                        id='confirmPsswd'
                        name="confirmPasswd"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    /><br />
                </form>
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
