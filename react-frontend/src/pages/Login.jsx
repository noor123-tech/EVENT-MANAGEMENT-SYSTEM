import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');const handleLogin = async () => {
  try {
    // Login to get token and user info if available
    const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
       const { token, role } = res.data;
  localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  

    // Save token to localStorage
    localStorage.setItem('token', token);
    console.log("Token received:", token);

    // If your login response contains role or user info, save it here
    // For example, if res.data has a user object:
    // localStorage.setItem('role', res.data.user.role);

    // Otherwise, you can skip this and only save token for now

    // Navigate to home page
    navigate('/home');
  } catch (err) {
    console.error(err.response);
    alert('Invalid credentials or unauthorized');
  }
};

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
      <br />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
