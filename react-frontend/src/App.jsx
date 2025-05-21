import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
// import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Testhomepage from './pages/Testhomepage';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import UpcomingEvents from './pages/UpcomingEvents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Testhomepage/>} />
        <Route path="/upcoming-events" element={<UpcomingEvents/>} />
        <Route  path='/admin' element={<AdminDashboard/>} />
         <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />

      </Routes>
    </Router>
  );
}

export default App;
