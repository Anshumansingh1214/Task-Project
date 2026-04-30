const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;
    
    // Check if project exists and user is admin
    const projectObj = await Project.findById(project);
    if (!projectObj) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    let query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;

    if (req.user.role === 'Member') {
      // Member can see tasks assigned to them or tasks in their projects
      // For simplicity in this requirement: members view assigned projects
      // To see tasks, let's allow them to see all tasks in their projects
      const memberProjects = await Project.find({ members: req.user.id }).select('_id');
      const projectIds = memberProjects.map(p => p._id);
      
      if (projectId) {
        if (!projectIds.some(id => id.toString() === projectId)) {
          return res.status(403).json({ message: 'Access denied' });
        }
      } else {
        query.project = { $in: projectIds };
      }
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email')
      .populate('project', 'name');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('project', 'name');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role check: Member can only update status of their assigned tasks
    if (req.user.role === 'Member') {
      if (task.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Members can only update status
      if (status) task.status = status;
    } else {
      // Admin can update everything
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo; // allow nulling
      if (status) task.status = status;
      if (dueDate) task.dueDate = dueDate;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
