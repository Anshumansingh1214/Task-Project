require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Find the Admin user
    const adminUser = await User.findOne({ email: 'anshrajput1214@gmail.com' });
    if (!adminUser) {
      console.log('Admin user not found. Please ensure the admin exists.');
      process.exit(1);
    }

    // Create dummy members
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const member1 = new User({
      username: 'Alice Smith',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'Member'
    });

    const member2 = new User({
      username: 'Bob Jones',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'Member'
    });

    await Promise.all([member1.save(), member2.save()]);
    console.log('Created members: Alice and Bob');

    // Create dummy projects
    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Overhauling the company website for better UX and performance.',
      createdBy: adminUser._id,
      members: [member1._id, member2._id]
    });

    const project2 = new Project({
      name: 'Mobile App Launch',
      description: 'Developing and launching the new iOS and Android mobile apps.',
      createdBy: adminUser._id,
      members: [member1._id]
    });

    await Promise.all([project1.save(), project2.save()]);
    console.log('Created projects: Website Redesign, Mobile App Launch');

    // Create dummy tasks
    const tasks = [
      new Task({
        title: 'Design Homepage UI',
        description: 'Create Figma mockups for the new homepage.',
        project: project1._id,
        assignedTo: member1._id,
        status: 'Done',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)) // 2 days ago
      }),
      new Task({
        title: 'Implement Navigation Bar',
        description: 'Build the responsive navbar using React and Tailwind.',
        project: project1._id,
        assignedTo: member2._id,
        status: 'In Progress',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)) // 3 days from now
      }),
      new Task({
        title: 'Setup API Gateway',
        description: 'Configure routing and auth for the mobile app endpoints.',
        project: project2._id,
        assignedTo: member1._id,
        status: 'Todo',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)) // 5 days from now
      }),
      new Task({
        title: 'Write User Documentation',
        description: 'Draft the FAQ and help center articles.',
        project: project1._id,
        assignedTo: member2._id,
        status: 'Todo',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)) // Overdue (1 day ago)
      })
    ];

    await Promise.all(tasks.map(t => t.save()));
    console.log('Created dummy tasks');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
