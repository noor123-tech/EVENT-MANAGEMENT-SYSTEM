import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventsList from '../components/EventsList';
import ThreeCompo from '../components/ThreeCompo';

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
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />

      <div className="pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero / Intro Component */}
          <ThreeCompo />

          {/* Events Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>

            {events.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No events available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Either map here or let EventsList component handle it */}
                <EventsList events={events} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;