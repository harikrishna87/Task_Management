const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

TimeEntrySchema.index({ taskId: 1 });
TimeEntrySchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  next();
});


module.exports = mongoose.model('TimeEntry', TimeEntrySchema);