import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const events = [
  {
    id: 1,
    title: 'Tech Innovators Conference',
    date: 'June 20, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    title: 'AI & Machine Learning Summit',
    date: 'July 5, 2025',
    time: '1:00 PM - 6:00 PM',
    location: 'New York, NY',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    date: 'August 15, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Austin, TX',
  },
];

const UpcomingEvents = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-black text-white min-h-screen p-10 pt-20 font-sans">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Upcoming Events
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="bg-white text-black rounded-xl shadow-xl p-6 hover:scale-105 transform transition duration-300 ease-in-out"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            >
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-700 mb-1">📅 {event.date}</p>
            <p className="text-gray-700 mb-1">🕒 {event.time}</p>
            <p className="text-gray-700">📍 {event.location}</p>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UpcomingEvents;