import { Request, Response } from 'express';
import { Issue } from '../models/issueModel';

export class IssueController {
    // Create a new issue
    /**
     * Handles the creation of a new issue.
     * 
     * This method receives a request containing issue data in the body,
     * creates a new issue instance, saves it to the database, and returns
     * the created issue in the response with a 201 status code. If an error
     * occurs during the process, it responds with a 400 status code and an
     * error message.
     * 
     * @param req - The HTTP request object containing the issue data in the body.
     * @param res - The HTTP response object used to send the response.
     * @returns A promise that resolves to an HTTP response containing the created issue
     *          or an error message if the creation fails.
     */
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