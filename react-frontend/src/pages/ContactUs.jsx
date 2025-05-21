import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Navbar";

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Add backend logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 bg-white text-black dark:bg-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-md placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 bg-white text-black dark:bg-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-md placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        rows="5"
        className="w-full p-3 bg-white text-black dark:bg-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-md placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
        required
      ></textarea>
      <button
        type="submit"
        className="w-full bg-black text-white dark:bg-white dark:text-black font-semibold py-2.5 rounded-md hover:opacity-90 transition"
      >
        Send Message
      </button>
    </form>
  );
}

// Main Contact Us Page
export default function ContactUs() {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Contact Us</h1>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions or need assistance? Our team is here to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details */}
            <div className="space-y-10">
              <div className="bg-gray-100 dark:bg-neutral-900 p-8 rounded-xl shadow-md transition">
                <h2 className="text-2xl font-bold mb-6 border-b border-neutral-300 dark:border-neutral-700 pb-3">
                  Get in Touch
                </h2>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">Email</h3>
                      <p>support@eventhub.com</p>
                      <p>info@eventhub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">Phone</h3>
                      <p>+1 (555) 123-4567</p>
                      <p>+1 (555) 765-4321</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">Address</h3>
                      <p>
                        123 Event Street, Suite 100<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-neutral-900 p-8 rounded-xl shadow-md transition">
                <h2 className="text-2xl font-bold mb-4 border-b border-neutral-300 dark:border-neutral-700 pb-3">
                  Business Hours
                </h2>
                <p className="text-gray-700 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-700 dark:text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-700 dark:text-gray-400">Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-100 dark:bg-neutral-900 p-8 rounded-xl shadow-md transition">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}