const TimeEntry = require('../models/TimeEntry');
const Task = require('../models/Task');

exports.createTimeEntry = async (req, res) => {
  try {
    const { taskId, startTime, endTime, notes } = req.body;
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const timeEntry = new TimeEntry({ taskId, startTime, endTime, notes });
    await timeEntry.save();
    res.status(201).json(timeEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating time entry', error: error.message });
  }
};

exports.getTimeEntriesForTask = async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find({ taskId: req.params.taskId }).sort({ startTime: -1 });
    res.json(timeEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time entries', error: error.message });
  }
};

exports.updateTimeEntry = async (req, res) => {
    try {
        const { startTime, endTime, notes } = req.body;
        const timeEntry = await TimeEntry.findByIdAndUpdate(
            req.params.id,
            { startTime, endTime, notes },
            { new: true, runValidators: true }
        );
        if (!timeEntry) return res.status(404).json({ message: 'Time entry not found' });
        res.json(timeEntry);
    } catch (error) {
        res.status(500).json({ message: 'Error updating time entry', error: error.message });
    }
};

exports.deleteTimeEntry = async (req, res) => {
    try {
        const timeEntry = await TimeEntry.findByIdAndDelete(req.params.id);
        if (!timeEntry) return res.status(404).json({ message: 'Time entry not found' });
        res.json({ message: 'Time entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting time entry', error: error.message });
    }
};