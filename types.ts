export interface ReactionItem {
  timestamp: string;
  emotion: string;
  line: string;
  description: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface VideoFile {
  file: File;
  previewUrl: string;
  base64Data?: string;
}