// src/pages/ContactPage.js
import React, { useState } from 'react';
import API from '../services/api';

/**
 * ContactPage component that allows users to send messages to the Goons Community team.
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  }); // Holds the form data
  const [loading, setLoading] = useState(false); // Indicates if form submission is in progress
  const [error, setError] = useState(null); // Holds any error that occurs during submission
  const [success, setSuccess] = useState(null); // Indicates successful form submission

  /**
   * Handle input changes in the contact form.
   *
   * @param {object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle form submission to send a message to the backend API.
   *
   * @param {object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await API.post('/contact', formData); // Replace '/contact' with your actual endpoint
      setSuccess('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setLoading(false);
    } catch (err) {
      console.error('Error sending contact message:', err);
      setError('Failed to send your message. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 p-8">
      <h1 className="text-3xl font-bold text-center text-goonsBlue">Contact Us</h1>
      <p className="mt-4 text-center">
        Have questions or feedback? We'd love to hear from you!
      </p>

      <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
              placeholder="Your Name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
              placeholder="you@example.com"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
              placeholder="Your message..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 bg-goonsGreen text-white rounded hover:bg-green-600 transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
