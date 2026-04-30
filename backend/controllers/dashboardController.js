const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getStats = async (req, res) => {
  try {
    let tasksQuery = {};
    
    if (req.user.role === 'Member') {
      const memberProjects = await Project.find({ members: req.user.id }).select('_id');
      const projectIds = memberProjects.map(p => p._id);
      tasksQuery.project = { $in: projectIds };
    }

    const tasks = await Task.find(tasksQuery);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done').length;

    res.json({
      totalTasks,
      completedTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
