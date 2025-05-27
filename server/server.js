const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./DBConfig/db');

const taskRoutes = require('./routes/taskRoutes');
const timeEntryRoutes = require('./routes/timeEntryRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/statistics', statisticsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));