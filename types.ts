export enum PhaseStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  content: string | null;
  error: string | null;
}

// FIX: Add UploadedFile interface for file uploads.
export interface UploadedFile {
  id: string;
  file: File;
}