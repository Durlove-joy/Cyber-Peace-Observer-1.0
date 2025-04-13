import mongoose from 'mongoose';
import { IIssue } from '../models/issueModel';

const connectDB = async () => {
    try {
        // Use the connection string from the .env file
        await mongoose.connect(process.env.MONGO_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if the connection fails
    }
};

export default connectDB;

export const saveIssue = async (issueData) => {
    const issue = new Issue(issueData);
    try {
        const savedIssue = await issue.save();
        return savedIssue;
    } catch (error) {
        console.error('Error saving issue:', error);
        throw error;
    }
};