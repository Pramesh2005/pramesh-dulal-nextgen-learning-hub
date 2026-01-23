const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/subjects', require('./routes/subject'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/mcq', require('./routes/mcq'));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));


app.get('/', (req, res) => {
  res.send('NextGen Learning Hub API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});