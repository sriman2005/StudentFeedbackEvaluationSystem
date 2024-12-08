import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import './Signup.css';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };

        // Username validation
        if (field === 'username') {
            if (!value.trim()) {
                newErrors.username = 'Username is required';
            } else if (value.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            } else {
                delete newErrors.username;
            }
        }

        // Email validation
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(value)) {
                newErrors.email = 'Invalid email format';
            } else {
                delete newErrors.email;
            }
        }

        // Phone number validation
        if (field === 'phoneNumber') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!value.trim()) {
                newErrors.phoneNumber = 'Phone number is required';
            } else if (!phoneRegex.test(value)) {
                newErrors.phoneNumber = 'Phone number must be 10 digits';
            } else {
                delete newErrors.phoneNumber;
            }
        }

        // Password validation
        if (field === 'password') {
            if (!value) {
                newErrors.password = 'Password is required';
            } else if (value.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else {
                delete newErrors.password;
            }
        }

        // Confirm password validation
        if (field === 'confirmPassword') {
            if (value !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            } else {
                delete newErrors.confirmPassword;
            }
        }

        setErrors(newErrors);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // If there are no validation errors, proceed with signup
        if (Object.keys(errors).length === 0) {
            try {
                await AuthService.signup({
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password
                });
                alert('Signup Successful');
                navigate('/login');
            } catch (error) {
                setErrors({
                    submit: error.response?.data || 'Signup Failed'
                });
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignup}>
                <h2>Sign Up</h2>

                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.username && (
                    <div className="error-message">{errors.username}</div>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.email && (
                    <div className="error-message">{errors.email}</div>
                )}

                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.phoneNumber && (
                    <div className="error-message">{errors.phoneNumber}</div>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.password && (
                    <div className="error-message">{errors.password}</div>
                )}

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword}</div>
                )}

                <button type="submit">Sign Up</button>

                <p>
                    Already have an account? 
                    <span onClick={handleLoginRedirect} className="login-link"> Login</span>
                </p>
            </form>
        </div>
    );
}

export default Signup;
