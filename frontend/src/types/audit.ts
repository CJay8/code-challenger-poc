export interface CodeIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  line: number;
  column: number;
  suggestion: string;
  codeSnippet: string;
}

export interface FileData {
  name: string;
  path: string;
  content: string;
  language: string;
  issues: CodeIssue[];
}

export interface AuditResult {
  totalIssues: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  files: FileData[];
  performanceScore: number;
}
