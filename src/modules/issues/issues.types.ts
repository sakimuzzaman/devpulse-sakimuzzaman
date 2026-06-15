export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type SortOrder = 'newest' | 'oldest';

export interface IssueRecord {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReporterInfo {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

export interface IssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter: ReporterInfo | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}

export interface ListIssuesQuery {
  sort: SortOrder;
  type?: IssueType;
  status?: IssueStatus;
}