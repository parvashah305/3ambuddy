import { useState } from 'react';
import { Send, Mail, MapPin, Phone, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <section id="contact" className="bg-gradient-to-br from-night-900 to-primary-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or need support? We're here to help. 
            Reach out to us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-300 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-night-700/50 border border-primary-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200 resize-none"
                  placeholder="Tell us more..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email Support</h4>
                    <p className="text-gray-300">support@3ambuddy.com</p>
                    <p className="text-gray-400 text-sm">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Crisis Support</h4>
                    <p className="text-gray-300">1-800-BUDDY-24</p>
                    <p className="text-gray-400 text-sm">24/7 emergency mental health support</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-primary-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Support Hours</h4>
                    <p className="text-gray-300">24/7 AI Support</p>
                    <p className="text-gray-300">Human Support: Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-400 mr-4 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Headquarters</h4>
                    <p className="text-gray-300">Mumbai, India</p>
                    <p className="text-gray-400 text-sm">Serving users globally</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                Your Privacy is Protected
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                All communications are encrypted end-to-end. We never share your personal information 
                or conversation data with third parties. Your trust and safety are our top priorities.
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-night-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary-500/20">
              <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-primary-400 hover:text-primary-300 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="block text-primary-400 hover:text-primary-300 transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="block text-primary-400 hover:text-primary-300 transition-colors duration-200">
                  Mental Health Resources
                </a>
                <a href="#" className="block text-primary-400 hover:text-primary-300 transition-colors duration-200">
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;