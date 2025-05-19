import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Navbar";

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Here you can add functionality to send form data to your server
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows="5"
        required
      ></textarea>
      <button type="submit" className="bg-primary text-white p-2 rounded">Send Message</button>
    </form>
  );
}

export default function ContactUs() {
  return (
    <div className="pt-24 pb-16 px-4">
        <Navbar/>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-muted/50 p-8 rounded-xl">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>support@eventhub.com</p>
                    <p>info@eventhub.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p>+1 (555) 123-4567</p>
                    <p>+1 (555) 765-4321</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p>123 Event Street, Suite 100<br/>San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-8 rounded-xl">
              <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-background rounded-xl border shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
