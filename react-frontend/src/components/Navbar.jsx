import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav>
      <button onClick={() => navigate('/home')}>Home</button>
      {role === 'admin' && <button onClick={() => navigate('/admin')}>Admin Dashboard</button>}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
