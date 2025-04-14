import express from 'express';
import axios from 'axios';
import { IssueController } from '../controllers/issueController';
import mongoose from 'mongoose';

const router = express.Router();
/**
 * An instance of the `IssueController` class responsible for handling
 * issue-related operations and business logic.
 */
const issueController = new IssueController();

router.get('/geocode', async (req: express.Request, res: express.Response) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: query,
                key: process.env.OPEN_CAGE_API_KEY,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch geocode data' });
    }
});

router.get('/test-db', async (req, res) => {
    try {
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().ping();
            res.status(200).json({ message: 'MongoDB connected successfully' });
        } else {
            res.status(500).json({ error: 'MongoDB connection is undefined' });
        }
        res.status(200).json({ message: 'MongoDB connected successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to MongoDB' });
    }
});

export function setRoutes(app: express.Router) {
    app.post('/api/issues', async (req, res, next) => {
        try {
            await issueController.createIssue(req, res);
        } catch (error) {
            next(error);
        }
    });
    app.get('/api/issues', issueController.getIssues.bind(issueController));
    app.get('/api/issues/:id', issueController.getIssueById.bind(issueController));
    app.use('/api/issues', router);
}

export default router;

public getIssues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Implementation
    } catch (error) {
        next(error);
    }
};