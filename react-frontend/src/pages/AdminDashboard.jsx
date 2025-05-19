// import React from 'react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// const AdminDashboard = () => {
//   const [events, setEvents] = useState([]);
//   const [form, setForm] = useState({ title: '', description: '', image: '', price: '' });
//   const [editEventId, setEditEventId] = useState(null);

//   // Fetch all events (no token)
//   const fetchEvents = async () => {
//     try {
//       const res = await axios.get('http://127.0.0.1:8000/api/events');
//       setEvents(res.data);
//     } catch (err) {
//       console.error('Failed to fetch events:', err);
//       alert('Failed to load events');
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Handle form input change
//   const handleChange = e => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Add new event
//   const handleAdd = async () => {
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/api/events', form);
//       setEvents(prev => [...prev, res.data]);
//       setForm({ title: '', description: '', image: '', price: '' });
//       alert('Event added successfully');
//     } catch (err) {
//       console.error('Add failed:', err);
//       alert('Failed to add event');
//     }
//   };

//   // Start editing event
//   const startEdit = event => {
//     setEditEventId(event.id);
//     setForm({
//       title: event.title,
//       description: event.description,
//       image: event.image || '',
//       price: event.price.toString(),
//     });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditEventId(null);
//     setForm({ title: '', description: '', image: '', price: '' });
//   };

//   // Update event
//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put(`http://127.0.0.1:8000/api/events/${editEventId}`, form);
//       setEvents(events.map(ev => (ev.id === editEventId ? res.data : ev)));
//       setEditEventId(null);
//       setForm({ title: '', description: '', image: '', price: '' });
//       alert('Event updated successfully');
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert('Failed to update event');
//     }
//   };

//   // Delete event
//   const handleDelete = async id => {
//     if (!window.confirm('Are you sure to delete this event?')) return;
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/events/${id}`);
//       setEvents(events.filter(ev => ev.id !== id));
//       alert('Event deleted successfully');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert('Failed to delete event');
//     }
//   };

//   return (
//     <>
//      <Navbar/>
// <div style={{ padding: '4rem 20px 20px'}}>

//     <div style={{ maxWidth: 600, margin: 'auto', padding: 20}}>
       
//       <h1>Admin Dashboard - Manage Events</h1>

//       <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
//         <h3>{editEventId ? 'Edit Event' : 'Add New Event'}</h3>
//         <input
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleChange}
//           style={{ width: '100%', marginBottom: 8 }}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           rows={3}
//           style={{ width: '100%', marginBottom: 8 }}
//         />
//         <input
//           name="image"
//           placeholder="Image URL"
//           value={form.image}
//           onChange={handleChange}
//           style={{ width: '100%', marginBottom: 8 }}
//         />
//         <input
//           name="price"
//           placeholder="Price"
//           type="number"
//           value={form.price}
//           onChange={handleChange}
//           style={{ width: '100%', marginBottom: 8 }}
//         />

//         {editEventId ? (
//           <>
//             <button onClick={handleUpdate} style={{ marginRight: 8 }}>Update Event</button>
//             <button onClick={cancelEdit}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={handleAdd}>Add Event</button>
//         )}
//       </div>

//       <h2>All Events</h2>
//       {events.length === 0 ? (
//         <p>No events found</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {events.map(ev => (
//             <li key={ev.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
//               <strong>{ev.title}</strong> - ${ev.price}
//               <br />
//               <small>{ev.description}</small>
//               <br />
//               {ev.image && <img src={ev.image} alt={ev.title} width={100} style={{ marginTop: 5 }} />}
//               <br />
//               <button onClick={() => startEdit(ev)} style={{ marginRight: 8 }}>Edit</button>
//               <button onClick={() => handleDelete(ev.id)}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//     </div>
//     </>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', price: '' });
  const [editEventId, setEditEventId] = useState(null);

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

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const startEdit = event => {
    setEditEventId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      image: event.image || '',
      price: event.price.toString(),
    });
  };

  const cancelEdit = () => {
    setEditEventId(null);
    setForm({ title: '', description: '', image: '', price: '' });
  };

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
    <>
      <Navbar />
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.welcome}>Hello Admin, welcome back! Manage your events below.</p>
        </header>

        <section style={styles.formSection} className="fade-in">
          <h3>{editEventId ? 'Edit Event' : 'Add New Event'}</h3>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={styles.textarea}
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
          />

          <div>
            {editEventId ? (
              <>
                <button onClick={handleUpdate} style={{ ...styles.button, ...styles.updateBtn }}>
                  Update Event
                </button>
                <button onClick={cancelEdit} style={{ ...styles.button, ...styles.cancelBtn }}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAdd} style={{ ...styles.button, ...styles.addBtn }}>
                Add Event
              </button>
            )}
          </div>
        </section>

        <section style={styles.listSection}>
          <h2>All Events</h2>
          {events.length === 0 ? (
            <p style={styles.noEventsText}>No events found</p>
          ) : (
            <ul style={styles.list}>
              {events.map(ev => (
                <li key={ev.id} style={styles.listItem} className="hover-shadow">
                  <div style={styles.eventHeader}>
                    <strong style={styles.eventTitle}>{ev.title}</strong>
                    <span style={styles.eventPrice}>${ev.price}</span>
                  </div>
                  <p style={styles.eventDescription}>{ev.description}</p>
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      width={150}
                      style={styles.eventImage}
                      loading="lazy"
                    />
                  )}
                  <div style={styles.actionButtons}>
                    <button onClick={() => startEdit(ev)} style={{ ...styles.button, ...styles.editBtn }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ev.id)} style={{ ...styles.button, ...styles.deleteBtn }}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>

      <style>{`
        /* Simple fade-in animation */
        .fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }

        /* Hover shadow on list items */
        .hover-shadow:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transform: translateY(-2px);
          transition: 0.3s ease;
          cursor: pointer;
        }

        /* Button hover transitions */
        button:hover {
          opacity: 0.85;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </>
  );
};

const styles = {
  container: {
    padding: '3rem 20px 40px',
    maxWidth: 800,
    margin: 'auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#222',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: '2.8rem',
    marginBottom: 8,
    color: '#4a90e2',
    fontWeight: '700',
  },
  welcome: {
    fontSize: '1.2rem',
    color: '#666',
  },
  formSection: {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 40,
    backgroundColor: '#fafafa',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 12,
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#4a90e2',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 12,
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#4a90e2',
    resize: 'vertical',
  },
  button: {
    padding: '10px 20px',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    marginTop: 8,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#4a90e2',
    color: 'white',
  },
  updateBtn: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
  },
  listSection: {
    marginBottom: 40,
  },
  noEventsText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid #eee',
    padding: '15px 10px',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: '1.2rem',
    color: '#333',
  },
  eventPrice: {
    fontWeight: '700',
    color: '#4a90e2',
  },
  eventDescription: {
    color: '#555',
    marginBottom: 8,
  },
  eventImage: {
    borderRadius: 6,
    marginBottom: 12,
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    backgroundColor: '#ffc107',
    color: '#333',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

export default AdminDashboard;

