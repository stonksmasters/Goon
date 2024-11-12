// src/components/Login.js
import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        walletAddress,
        username,
        signature,
      });
      // Handle successful login (e.g., store token, redirect)
      console.log('Login successful:', response.data);
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username (optional)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <div>Error logging in.</div>}
    </div>
  );
};

export default Login;
