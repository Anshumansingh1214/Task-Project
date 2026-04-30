const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All project routes require authentication
router.use(auth);

// Member accessible routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// Admin only routes
router.post('/', role(['Admin']), projectController.createProject);
router.put('/:id', role(['Admin']), projectController.updateProject);
router.delete('/:id', role(['Admin']), projectController.deleteProject);
router.post('/:id/members', role(['Admin']), projectController.addMember);
router.delete('/:id/members', role(['Admin']), projectController.removeMember);

module.exports = router;
