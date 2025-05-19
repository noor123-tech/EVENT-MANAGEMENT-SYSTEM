// import React from 'react';
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleRegister = async () => {
//     try {
//       await axios.post('http://127.0.0.1:8000/api/register', form);
//       alert('Registration successful. Please login.');
//       navigate('/login');
//     } catch (err) {
//       console.error(err.response.data);
//       alert('Registration failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input name="name" placeholder="Name" onChange={handleChange} />
//       <br />
//       <input name="email" placeholder="Email" type="email" onChange={handleChange} />
//       <br />
//       <input name="password" placeholder="Password" type="password" onChange={handleChange} />
//       <br />
//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/register', form);
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      {/* Left Section (Info) */}
      <div className="hidden sm:flex sm:w-1/2 lg:w-2/3 bg-gradient-to-br from-purple-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-6">Join EventHub Today</h1>
          <p className="text-xl mb-8">Create an account to start organizing events and managing registrations.</p>
          <ul className="space-y-2 text-white/90">
            <li>✅ Free to get started</li>
            <li>✅ Powerful event tools</li>
            <li>✅ Secure payments</li>
            <li>✅ 24/7 support</li>
          </ul>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full sm:w-1/2 lg:w-1/3 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <input
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
