import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.1.6:4000/login', {
                name: name.trim(),
                password: password.trim()
            });
            // console.log("Login success", response.data.token);
            console.log(name, password);
            localStorage.setItem('token', response.data.token);
            navigate('/chat'); 
        } catch (error) {
            console.error("Login failed", error);
            setError('Invalid credentials');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin(); // ✅ no premature navigate
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h3 style={{ textAlign: 'center' }}>Login to Chat</h3>

            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

            <Input
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '100%', padding: 8, marginBottom: 10 }}
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '100%', padding: 8, marginBottom: 10 }}
            />

            <Button
                onClick={handleLogin} // ✅ call only login, not handleKeyDown
                style={{
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                Login
            </Button>
        </div>
    );
};

export default Login;
