const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schemas/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const updateRoles = async () => {
    await connectDB();

    try {
        // Update Teacher
        const teacher = await User.findOneAndUpdate(
            { email: 'teacher@gmail.com' },
            { role: 'teacher' },
            { new: true }
        );
        console.log('Updated Teacher:', teacher);

        // Update Admin
        const admin = await User.findOneAndUpdate(
            { email: 'admin@gmail.com' },
            { role: 'admin' },
            { new: true }
        );
        console.log('Updated Admin:', admin);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateRoles();
