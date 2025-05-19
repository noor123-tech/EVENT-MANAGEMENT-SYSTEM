import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', price: '' });
  const [editEventId, setEditEventId] = useState(null);

  // Fetch all events (no token)
  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      alert('Failed to load events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input change
  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add new event
  const handleAdd = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/events', form);
      setEvents(prev => [...prev, res.data]);
      setForm({ title: '', description: '', image: '', price: '' });
      alert('Event added successfully');
    } catch (err) {
      console.error('Add failed:', err);
      alert('Failed to add event');
    }
  };

  // Start editing event
  const startEdit = event => {
    setEditEventId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      image: event.image || '',
      price: event.price.toString(),
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditEventId(null);
    setForm({ title: '', description: '', image: '', price: '' });
  };

  // Update event
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/events/${editEventId}`, form);
      setEvents(events.map(ev => (ev.id === editEventId ? res.data : ev)));
      setEditEventId(null);
      setForm({ title: '', description: '', image: '', price: '' });
      alert('Event updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update event');
    }
  };

  // Delete event
  const handleDelete = async id => {
    if (!window.confirm('Are you sure to delete this event?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}`);
      setEvents(events.filter(ev => ev.id !== id));
      alert('Event deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Admin Dashboard - Manage Events</h1>

      <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
        <h3>{editEventId ? 'Edit Event' : 'Add New Event'}</h3>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 8 }}
        />

        {editEventId ? (
          <>
            <button onClick={handleUpdate} style={{ marginRight: 8 }}>Update Event</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAdd}>Add Event</button>
        )}
      </div>

      <h2>All Events</h2>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map(ev => (
            <li key={ev.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
              <strong>{ev.title}</strong> - ${ev.price}
              <br />
              <small>{ev.description}</small>
              <br />
              {ev.image && <img src={ev.image} alt={ev.title} width={100} style={{ marginTop: 5 }} />}
              <br />
              <button onClick={() => startEdit(ev)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => handleDelete(ev.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
