const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  dueDate: {
    type: Date,
  },
}, { timestamps: true });

TaskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', TaskSchema);