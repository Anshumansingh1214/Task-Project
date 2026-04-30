const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All task routes require authentication
router.use(auth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);

// Admin only (creation and deletion)
router.post('/', role(['Admin']), taskController.createTask);
router.delete('/:id', role(['Admin']), taskController.deleteTask);

// Update (Admin can update everything, Member can only update status of assigned tasks)
router.put('/:id', taskController.updateTask);

module.exports = router;
