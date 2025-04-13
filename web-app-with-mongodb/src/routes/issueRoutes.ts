import { Router } from 'express';
import IssueController from '../controllers/issueController';

const router = Router();
const issueController = new IssueController();

export function setRoutes(app: Router) {
    app.post('/api/issues', issueController.createIssue.bind(issueController));
    app.get('/api/issues', issueController.getIssues.bind(issueController));
    app.get('/api/issues/:id', issueController.getIssueById.bind(issueController));
}