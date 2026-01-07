import { useEffect, useState } from "react";
import axios from "axios";

export default function AvailableExam() {
  const [subjects, setSubjects] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const [subjectPage, setSubjectPage] = useState({});
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 6;

  // Load subjects from API
  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("token"); // add your JWT token here
      const res = await axios.get("http://localhost:5000/api/subjects/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSubjects([]); // prevent undefined
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (currentExam && timeLeft > 0 && !examSubmitted) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && currentExam && !examSubmitted) handleSubmit();
  }, [timeLeft, currentExam, examSubmitted]);

  const startExam = (subjectId, pdfId, mcqs, title) => {
    if (!mcqs || mcqs.length === 0) return;
    setCurrentExam({ subjectId, pdfId, mcqs, title });
    setAnswers({});
    setTimeLeft(1800);
    setExamSubmitted(false);
    setScore(null);
  };

  const handleSubmit = () => {
    let correct = 0;
    currentExam.mcqs.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setExamSubmitted(true);
  };

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  // ================== EXAM MODE ==================
  if (currentExam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-10">
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-white">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-extrabold">📝 {currentExam.title}</h2>
            <div className="flex items-center gap-3 bg-red-600/20 px-6 py-3 rounded-2xl">
              ⏱️ <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {!examSubmitted ? (
            <>
              <div className="space-y-8">
                {currentExam.mcqs.map((q, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-8 rounded-2xl border border-white/20"
                  >
                    <p className="text-xl font-bold mb-6">
                      {i + 1}. {q.question}
                    </p>
                    {q.options.map((opt, j) => (
                      <label
                        key={j}
                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-white/10"
                      >
                        <input
                          type="radio"
                          name={`q-${i}`}
                          checked={answers[i] === j}
                          onChange={() => setAnswers({ ...answers, [i]: j })}
                          className="scale-150"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-12 w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-2xl font-bold hover:scale-105 transition"
              >
                🚀 Submit Exam
              </button>
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-6xl font-extrabold text-green-400 mb-6">🎉 Completed!</h2>
              <p className="text-4xl mb-10">
                Score: <b>{score}</b> / {currentExam.mcqs.length}
              </p>
              <button
                onClick={() => setCurrentExam(null)}
                className="px-12 py-5 bg-indigo-600 rounded-2xl text-xl font-bold hover:scale-105 transition"
              >
                ⬅ Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= DASHBOARD MODE =================
  if (loading) return <p className="text-center mt-20 text-xl">Loading exams...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10">
      <h1 className="text-5xl font-extrabold text-center mb-4 text-indigo-800">
        🎓 Available Exams
      </h1>
      <p className="text-center text-gray-600 mb-16">
        Choose a subject and start your exam
      </p>

      <div className="max-w-7xl mx-auto space-y-24">
        {subjects
          .filter(
            (s) =>
              s?.name &&
              Array.isArray(s?.pdfs) &&
              s.pdfs.some((p) => Array.isArray(p.mcqs) && p.mcqs.length > 0)
          )
          .map((subject) => {
            const examPdfs = subject.pdfs.filter(
              (p) => Array.isArray(p.mcqs) && p.mcqs.length > 0
            );

            const currentPage = subjectPage[subject._id] || 1;
            const totalPages = Math.ceil(examPdfs.length / ITEMS_PER_PAGE);
            const visiblePdfs = examPdfs.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            );

            return (
              <div
                key={subject._id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-xl"
              >
                <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-4">
                  {subject.name}
                </h2>
                <p className="text-center text-gray-600 mb-12">
                  {examPdfs.length} Available Exams
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {visiblePdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      className="group bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-3 hover:shadow-2xl transition"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {pdf.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">{pdf.mcqs.length} Questions</p>

                      <button
                        onClick={() =>
                          startExam(subject._id, pdf._id, pdf.mcqs, pdf.title)
                        }
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition"
                      >
                        Start Exam
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subject Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-3 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSubjectPage({ ...subjectPage, [subject._id]: i + 1 })
                        }
                        className={`w-12 h-12 rounded-full font-bold transition ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white scale-110"
                            : "bg-white hover:bg-indigo-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
