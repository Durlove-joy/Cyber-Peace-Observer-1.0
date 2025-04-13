import { Request, Response } from 'express';
import { Issue } from '../models/issueModel';

export class IssueController {
    // Create a new issue
    public async createIssue(req: Request, res: Response): Promise<Response> {
        try {
            const issue = new Issue(req.body);
            await issue.save();
            return res.status(201).json(issue);
        } catch (error) {
            return res.status(400).json({ message: 'Error creating issue', error });
        }
    }

    // Get all issues
    public async getIssues(req: Request, res: Response): Promise<Response> {
        try {
            const issues = await Issue.find();
            return res.status(200).json(issues);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving issues', error });
        }
    }

    // Get a single issue by ID
    public async getIssueById(req: Request, res: Response): Promise<Response> {
        try {
            const issue = await Issue.findById(req.params.id);
            if (!issue) {
                return res.status(404).json({ message: 'Issue not found' });
            }
            return res.status(200).json(issue);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving issue', error });
        }
    }
}