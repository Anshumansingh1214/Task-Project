require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await User.findOneAndUpdate(
      { email: 'anshrajput1214@gmail.com' },
      { role: 'Admin' },
      { new: true }
    );

    if (result) {
      console.log(`Successfully updated ${result.email} to Admin!`);
    } else {
      console.log('User not found! Are you sure the email is correct?');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
};

makeAdmin();
