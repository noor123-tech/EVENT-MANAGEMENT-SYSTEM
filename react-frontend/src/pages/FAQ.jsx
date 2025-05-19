import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom"; // if you're using react-router, otherwise use <a> tag
import Navbar from "../components/Navbar";
// Simple Button component
function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition " +
        (className || "")
      }
    >
      {children}
    </button>
  );
}

// Simple FaqAccordion component with dummy questions
function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is EventHub?",
      answer:
        "EventHub is a platform that helps you manage and participate in tech competitions easily.",
    },
    {
      question: "How do I register for a competition?",
      answer:
        "You can register by creating an account and selecting the competition you want to join from the dashboard.",
    },
    {
      question: "Can I submit multiple entries?",
      answer:
        "Submission rules vary per competition. Please check the competition guidelines before submitting.",
    },
  ];

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 cursor-pointer bg-muted/50"
          onClick={() => toggle(index)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{faq.question}</h3>
            {activeIndex === index ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          {activeIndex === index && (
            <p className="mt-2 text-muted-foreground">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="pt-24 pb-16 px-4">
        <Navbar/>
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about EventHub.
          </p>
        </div>

        <FaqAccordion />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
          <Link to="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
