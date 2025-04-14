import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
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