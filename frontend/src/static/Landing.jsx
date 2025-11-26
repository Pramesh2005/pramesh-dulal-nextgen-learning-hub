import { Link } from 'react-router-dom';
import { FaBrain, FaChartLine, FaLock } from 'react-icons/fa';
import hero from '../assets/hero.png';


export default function Landing() {
  return (
    <div className="bg-slate-100 overflow-hidden">


      {/* HERO SECTION */}
      <section
        className="relative pt-28 pb-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Light glow */}
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 text-white px-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            NextGen <span className="text-yellow-400">Learning Hub</span>
          </h1>

          <p className="text-xl md:text-2xl max-w-4xl mx-auto mt-6 opacity-95">
            Upload PDF → Get <span className="font-bold">AI-powered MCQs</span> instantly
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
            >
              Start Learning Free
            </Link>

            <Link
              to="/about"
              className="px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/*  FEATURES (GLASS BLUR STYLE) */}
      <section className="relative py-8 -mt-14">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-200"></div>

        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-md"></div>

        <div className="relative z-10">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">
            Platform Features
          </h2>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6">
            {[
              { icon: <FaBrain className="text-5xl text-blue-600 mb-5 mx-auto" />, title: "AI MCQ Generation", desc: "Convert PDFs into smart quizzes instantly" },
              { icon: <FaChartLine className="text-5xl text-pink-600 mb-5 mx-auto" />, title: "Progress Tracking", desc: "Track scores, rankings, and growth" },
              { icon: <FaLock className="text-5xl text-green-600 mb-5 mx-auto" />, title: "Secure System", desc: "Login security with admin control" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-xl hover:scale-105 transition duration-300 text-center"
              >
                {item.icon}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 py-14">
        <div className="max-w-4xl mx-auto text-center text-white px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Transform Learning?
          </h2>

          <p className="text-base opacity-90 mb-6">
            Join students and teachers using AI-powered education
          </p>

          <Link
            to="/register"
            className="bg-white text-indigo-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition inline-block"
          >
            Join Now – Free
          </Link>
        </div>
      </section>

     
    </div>
  );
}
