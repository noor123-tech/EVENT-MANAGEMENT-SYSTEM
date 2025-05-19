// import React from 'react';
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');const handleLogin = async () => {
//   try {
//     // Login to get token and user info if available
//     const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
//        const { token, role } = res.data;
//   localStorage.setItem('token', token);
//     localStorage.setItem('role', role);
  

//     // Save token to localStorage
//     localStorage.setItem('token', token);
//     console.log("Token received:", token);

//     // If your login response contains role or user info, save it here
//     // For example, if res.data has a user object:
//     // localStorage.setItem('role', res.data.user.role);

//     // Otherwise, you can skip this and only save token for now

//     // Navigate to home page
//     navigate('/home');
//   } catch (err) {
//     console.error(err.response);
//     alert('Invalid credentials or unauthorized');
//   }
// };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
//       <br />
//       <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
//       <br />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      console.log('Token received:', token);
      navigate('/home');
    } catch (err) {
      console.error(err.response);
      alert('Invalid credentials or unauthorized');
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
          <h1 className="text-4xl font-bold mb-6">Welcome Back to EventHub</h1>
          <p className="text-xl mb-8">
            Manage your events, track registrations, and connect with your audience.
          </p>
          <ul className="space-y-2 text-white/90">
            <li>✅ Secure login</li>
            <li>✅ Manage events easily</li>
            <li>✅ Analyze performance</li>
            <li>✅ 24/7 support</li>
          </ul>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full sm:w-1/2 lg:w-1/3 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Log In</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-medium">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
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
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </button>
          </p>

          <p className="mt-2 text-center text-sm text-gray-600">
            {/* Forgot your password?{" "} */}
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 font-medium hover:underline"
            >
              {/* Reset here */}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

