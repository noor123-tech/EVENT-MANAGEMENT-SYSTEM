import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register', form);
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <br />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} />
      <br />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
