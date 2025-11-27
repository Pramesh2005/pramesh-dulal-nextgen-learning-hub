import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import contact from '../assets/contactPage.png';

export default function Contact() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/*HERO + FORM SPLIT*/}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Hero Text with Background */}
        <div 
          className="relative h-64 md:h-full flex items-center justify-center text-white p-6 rounded-xl overflow-hidden"
          style={{ backgroundImage: `url(${contact})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Transparent overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Text content */}
          <div className="relative text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-base md:text-lg max-w-md opacity-95">
              We'd love to hear from you! Reach out for support, partnerships, or any inquiries.
            </p>
            <div className="hidden md:block mt-2">
              <p className="text-sm text-gray-200">We respond within 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <form className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Message</label>
              <textarea 
                placeholder="Your Message" 
                className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-8 px-4 max-w-4xl mx-auto grid md:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
          <FaMapMarkerAlt className="text-green-500 text-2xl mb-2" />
          <h3 className="text-lg font-semibold mb-1">Address</h3>
          <p className="text-sm">Maitidevi, Kathmandu</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
          <FaEnvelope className="text-green-500 text-2xl mb-2" />
          <h3 className="text-lg font-semibold mb-1">Email</h3>
          <p className="text-sm">support@nextgenlearninghub.com</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
          <FaPhoneAlt className="text-green-500 text-2xl mb-2" />
          <h3 className="text-lg font-semibold mb-1">Phone</h3>
          <p className="text-sm">+977 98547524525</p>
        </div>
      </section>

      {/* CTA*/}
      <section className="bg-green-500 text-white py-8 text-center rounded-t-2xl mt-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Have Questions?</h2>
        <p className="text-sm md:text-base max-w-xl mx-auto mb-3 opacity-90">
          Our team is ready to assist you. Reach out and let's make learning better together!
        </p>
        <a 
          href="/register" 
          className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Join Now – Free
        </a>
      </section>
    </div>
  );
}
