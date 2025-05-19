import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "../assets/Home.jpg";
// import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import EventsList from "../components/EventsList";
import Navbar from "../components/Navbar";
function Button({ children, variant = "solid", size = "md", className = "", ...props }) {
  const base = "font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2"
  };
  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
  };
  const cls = [base, sizes[size], variants[variant], className].join(" ");
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
export default function Testhomepage() {
  return (
        

  // <div className="p-4">
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
        <Navbar />
     <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Complete <br /><span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Event Management</span></h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">The all-in-one platform for planning, organizing, and managing events of any size with powerful tools for professionals.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register"><Button size="lg">Get Started<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <Link to="/contact"><Button size="lg" variant="outline">Contact Us</Button></Link>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <img src={HomeImage} alt="Event Management" className="rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-cover" />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Successful Events</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to create and manage events that leave a lasting impression.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <CalendarDays className="h-10 w-10 text-primary" />, title: "Event Planning", description: "Create and manage events with our intuitive dashboard. Set dates, locations, and ticket prices with ease." },
              { icon: <Users className="h-10 w-10 text-primary" />, title: "Attendee Management", description: "Track registrations, send updates, and manage your attendees all in one place." },
              { icon: <BarChart3 className="h-10 w-10 text-primary" />, title: "Analytics & Reporting", description: "Get detailed insights into your events with comprehensive analytics and reporting tools." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-sm border"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">Discover exciting events happening soon in your area.</p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0">
              <Button variant="outline">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
         
            <EventsList/>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Streamline Your Event Management?</h2>
                <p className="text-white/90 text-lg max-w-lg">Join thousands of event professionals who are saving time and increasing efficiency with EventMaster.</p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">Get Started</Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:text-primary w-full sm:w-auto">Contact Sales</Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <img   src={HomeImage}
                   alt="Event Planning" className="rounded-xl shadow-lg w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 mt-auto">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">EventHub</h3>
              <p className="text-muted-foreground">Creating memorable events made simple.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        <div className="border-t mt-8 pt-8 flex justify-center">
  <p className="text-center text-muted-foreground">
    © {new Date().getFullYear()} EventHub. All rights reserved.
  </p>           
</div>
        </div>
      </footer>
    </div>
    // </div>
  );
}
