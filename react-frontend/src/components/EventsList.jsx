import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events')
      .then(response => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch events');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map(event => (
            <li key={event.id} style={{ border: '1px solid #ccc', marginBottom: 12, padding: 12, borderRadius: 6 }}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {event.image && <img src={event.image} alt={event.title} style={{ maxWidth: '100%', height: 'auto' }} />}
              <p><strong>Price:</strong> ${event.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;
