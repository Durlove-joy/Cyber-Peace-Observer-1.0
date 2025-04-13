export interface Issue {
    issueType: string;
    subType: string;
    location: string;
    description: string;
    email: string;
    lat: number;
    lon: number;
}

export interface RequestWithIssue extends Request {
    body: Issue;
}