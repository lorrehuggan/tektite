// Types for file operations that match the Rust backend models
import type { AppError } from "./errors";
import type { NoteInfo } from "./note";

// File operation result types
export type FileOperationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AppError;
    };

// Utility types for common operations
export interface FileStats {
  exists: boolean;
  size?: number;
  modified_at?: string;
  is_directory?: boolean;
}

export interface DirectoryListing {
  files: NoteInfo[];
  total_count: number;
  markdown_count: number;
}
