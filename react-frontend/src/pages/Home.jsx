import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventsList from '../components/EventsList';
const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load events');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Events</h2>
      {events.length === 0 ? <p>No events yet</p> : (
        <ul>
            <EventsList/>
          {/* {events.map(event => (
            <li key={event.id}>{event.name}</li>
          ))} */}
        </ul>
      )}
    </div>
  );
};

export default Home;
