const { body, validationResult } = require('express-validator');

const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateTimeEntry = [
  body('taskId').notEmpty().withMessage('Task ID is required').isMongoId().withMessage('Invalid Task ID'),
  body('startTime').notEmpty().withMessage('Start time is required').isISO8601().toDate(),
  body('endTime').optional().isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.endTime && new Date(req.body.startTime) >= new Date(req.body.endTime)) {
        return res.status(400).json({ errors: [{ msg: 'End time must be after start time' }] });
    }
    next();
  },
];

module.exports = { validateTask, validateTimeEntry };