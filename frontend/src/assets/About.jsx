import { FaBrain, FaCertificate, FaUsersCog, FaChartLine, FaChalkboardTeacher, FaLock } from 'react-icons/fa';
import mission from '../assets/mission.png';
import research from '../assets/research.png';
import contactHero from '../assets/contactHero.png';

export default function About() {
  const features = [
    { icon: <FaBrain className="text-4xl text-blue-600 mb-4" />, title: 'AI-Generated MCQs', description: 'Teachers upload PDFs, and our AI automatically generates quizzes for exams and assignments.' },
    { icon: <FaCertificate className="text-4xl text-green-500 mb-4" />, title: 'Instant Certificates', description: 'Students receive certificates immediately after completing courses or assessments.' },
    { icon: <FaChartLine className="text-4xl text-pink-500 mb-4" />, title: 'Smart Analytics', description: 'Monitor student performance and learning trends with AI-driven insights.' },
    { icon: <FaChalkboardTeacher className="text-4xl text-yellow-500 mb-4" />, title: 'Interactive Learning', description: 'Engage students with interactive lessons, personalized learning paths, and quizzes.' },
    { icon: <FaUsersCog className="text-4xl text-purple-500 mb-4" />, title: 'Admin Management', description: 'Admins can efficiently manage teachers, students, and courses through a modern dashboard.' },
    { icon: <FaLock className="text-4xl text-red-500 mb-4" />, title: 'Secure & Reliable', description: 'End-to-end encryption and cloud storage ensure your data stays safe and private.' },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">

      {/* ================= HERO ================= */}
      <section
        className="relative text-white py-24 px-6 text-center"
        style={{ backgroundImage: `url(${contactHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About NextGen Learning Hub</h1>
          <p className="text-lg md:text-xl opacity-95">
            Empowering education with AI-powered tools, interactive learning, and instant assessments for students and teachers.
          </p>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>
        <div className="space-y-16 md:space-y-24">

          {/* Mission */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">Founded With a Mission</h3>
              <p className="text-gray-700 text-base md:text-lg">
                NextGen Learning Hub was founded to make high-quality education accessible to all. By integrating AI and interactive learning, we aim to make studying engaging and personalized.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src={mission} alt="mission" className="rounded-3xl shadow-lg w-full object-cover" />
            </div>
          </div>

          {/* Innovation */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 md:flex-row-reverse">
            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">Innovation & Growth</h3>
              <p className="text-gray-700 text-base md:text-lg">
                Over the years, we have incorporated cutting-edge AI tools, advanced analytics, and automated systems to help teachers focus on teaching while students enjoy personalized learning experiences.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src={research} alt="innovation" className="rounded-3xl shadow-lg w-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Platform Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 text-center"
            >
              {feature.icon}
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/*  CTA  */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-12 md:py-16 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Join the AI Learning Revolution</h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto mb-4 opacity-90">
          Sign up today and explore AI-powered learning for students and teachers alike.
        </p>
        <a
          href="/register"
          className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Get Started – Free
        </a>
      </section>

    
    </div>
  );
}
