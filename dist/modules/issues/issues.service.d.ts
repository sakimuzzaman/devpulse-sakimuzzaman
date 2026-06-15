import { JwtPayload } from '../../utils/jwt.js';
import { CreateIssueInput, IssueRecord, IssueWithReporter, ListIssuesQuery, UpdateIssueInput } from './issues.types.js';
export declare function createIssue(input: CreateIssueInput, reporterId: number): Promise<IssueRecord>;
export declare function listIssues(query: ListIssuesQuery): Promise<IssueWithReporter[]>;
export declare function getIssueById(id: number): Promise<IssueWithReporter>;
export declare function updateIssue(id: number, input: UpdateIssueInput, requester: JwtPayload): Promise<IssueRecord>;
export declare function deleteIssue(id: number): Promise<void>;
//# sourceMappingURL=issues.service.d.ts.map