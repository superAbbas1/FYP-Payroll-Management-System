import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/login", { email, password })
            .then((res) => {
                alert("Login successful");
                navigate('/dashboard');
            })
            .catch((err) => {
                console.error(err);
                alert("Invalid email or password");
            });
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="title">Payroll Management System</h1>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        className='inputBox' 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder='Enter Email' 
                    />
                    <input 
                        className='inputBox' 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder='Enter Password' 
                    />
                    <button type='submit' className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
