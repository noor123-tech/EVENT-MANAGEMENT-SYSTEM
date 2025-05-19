import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Reuse the same Button from Home, or define your own
function Button({ children, size = 'sm', variant = 'solid', className = '', ...props }) {
  const base = 'font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  const variants = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };
  const cls = [base, sizes[size], variants[variant], className].join(' ');
  return <button className={cls} {...props}>{children}</button>;
}

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events')
      .then(({ data }) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch events');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, idx) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="group bg-background rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all"
        >
          <div className="relative h-48 overflow-hidden">
            {event.image ? (
              <img src={event.image} alt={event.title} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
            ) : (
              <div className="bg-gray-200 w-full h-full" />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <div className="flex items-center text-muted-foreground mb-1">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">${event.price}</span>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EventsList;
