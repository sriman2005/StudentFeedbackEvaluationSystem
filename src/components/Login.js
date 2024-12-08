import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await AuthService.login(username, password);
            if (user.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (user.role === 'STUDENT') {
                navigate('/student-dashboard');
            } else {
                alert('Unknown role');
            }
        } catch (error) {
            alert('Invalid Credentials');
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="login-page">
            <h1 className="page-title">STUDENT FEEDBACK MANAGEMENT SYSTEM</h1>
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    <p>New user? <span onClick={handleSignupRedirect}>Register</span></p>
                </form>
            </div>
        </div>
    );
}

export default Login;