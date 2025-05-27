const Task = require('../models/Task');
const TimeEntry = require('../models/TimeEntry');
const moment = require('moment');

exports.getBasicStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'done' });
    const todoTasks = await Task.countDocuments({ status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });

    const totalTimeEntries = await TimeEntry.aggregate([
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ]);
    const totalTimeTracked = totalTimeEntries.length > 0 ? totalTimeEntries[0].totalDuration : 0;

    const timePerTask = await TimeEntry.aggregate([
        { $group: { _id: '$taskId', totalDuration: { $sum: '$duration' } } },
        { $lookup: { from: 'tasks', localField: '_id', foreignField: '_id', as: 'taskDetails' } },
        { $unwind: '$taskDetails' },
        { $project: { taskId: '$_id', taskTitle: '$taskDetails.title', totalDuration: 1, _id: 0 } },
        { $sort: { totalDuration: -1 } }
    ]);

    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const tasksCompletedThisWeek = await Task.countDocuments({
        status: 'done',
        updatedAt: { $gte: startOfWeek, $lte: endOfWeek }
    });


    res.json({
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      totalTimeTrackedMinutes: totalTimeTracked,
      timePerTask,
      tasksCompletedThisWeek
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};