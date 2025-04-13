import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  issueType: string;
  subType: string;
  location: string;
  description: string;
  email: string;
  lat: number;
  lon: number;
}

const issueSchema: Schema = new Schema({
  issueType: { type: String, required: true },
  subType: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
}, { timestamps: true });

const IssueModel = mongoose.model<IIssue>('Issue', issueSchema);

export default IssueModel;