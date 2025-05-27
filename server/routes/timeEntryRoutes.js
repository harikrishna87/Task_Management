const express = require('express');
const router = express.Router();
const timeEntryController = require('../controllers/timeEntryController');
const { validateTimeEntry } = require('../middleware/validationMiddleware');

router.post('/', validateTimeEntry, timeEntryController.createTimeEntry);
router.get('/task/:taskId', timeEntryController.getTimeEntriesForTask);
router.put('/:id', validateTimeEntry, timeEntryController.updateTimeEntry);
router.delete('/:id', timeEntryController.deleteTimeEntry);


module.exports = router;