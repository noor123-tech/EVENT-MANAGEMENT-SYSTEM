import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-white text-black px-5 py-2 rounded-full font-medium shadow hover:shadow-lg transition duration-300 " +
        (className || "")
      }
    >
      {children}
    </button>
  );
}

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
    <div className="space-y-6">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-xl p-5 bg-neutral-900 text-white shadow-md transition-all duration-300 cursor-pointer ${
              isOpen ? "ring-1 ring-white" : ""
            }`}
            onClick={() => toggle(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <div
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-400 text-sm">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 text-lg">
              Find answers to common questions about EventHub.
            </p>
          </div>

          <FaqAccordion />

          <div className="mt-14 text-center">
            <p className="text-gray-400 mb-4 text-sm">
              Still have questions? We're here to help.
            </p>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}