import { invoke } from "@tauri-apps/api/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError, NoteInfo } from "@/types/file";

import { FileApi } from "../file";

// Mock the Tauri invoke function
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockInvoke = vi.mocked(invoke);

describe("FileApi.listNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockNoteInfos: NoteInfo[] = [
    {
      path: "/test/folder/note1.md",
      title: "Note 1",
      size: 1024,
      modified_at: "1703251200",
      is_directory: false,
    },
    {
      path: "/test/folder/note2.md",
      title: "Note 2",
      size: 2048,
      modified_at: "1703337600",
      is_directory: false,
    },
    {
      path: "/test/folder/subfolder",
      title: "subfolder",
      size: 0,
      modified_at: "1703424000",
      is_directory: true,
    },
  ];

  it("should successfully list notes from a directory", async () => {
    // Arrange
    const directoryPath = "/test/folder";
    mockInvoke.mockResolvedValue(mockNoteInfos);

    // Act
    const result = await FileApi.listNotes(directoryPath);

    // Assert
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenCalledWith("list_notes", {
      directoryPath,
    });
    expect(result).toEqual(mockNoteInfos);
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("path", "/test/folder/note1.md");
    expect(result[0]).toHaveProperty("title", "Note 1");
    expect(result[0]).toHaveProperty("is_directory", false);
  });

  it("should return empty array when directory has no notes", async () => {
    // Arrange
    const directoryPath = "/empty/folder";
    mockInvoke.mockResolvedValue([]);

    // Act
    const result = await FileApi.listNotes(directoryPath);

    // Assert
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenCalledWith("list_notes", {
      directoryPath,
    });
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should handle different directory path formats", async () => {
    // Arrange
    const testPaths = [
      "/home/user/notes",
      "C:\\Users\\User\\Notes",
      "./relative/path",
      "../parent/folder",
      "simple-folder-name",
    ];

    mockInvoke.mockResolvedValue(mockNoteInfos);

    // Act & Assert
    for (const path of testPaths) {
      await FileApi.listNotes(path);
      expect(mockInvoke).toHaveBeenCalledWith("list_notes", {
        directoryPath: path,
      });
    }

    expect(mockInvoke).toHaveBeenCalledTimes(testPaths.length);
  });

  it("should throw formatted error when Tauri command fails with string error", async () => {
    // Arrange
    const directoryPath = "/invalid/path";
    const errorMessage = "Directory not found";
    mockInvoke.mockRejectedValue(errorMessage);

    // Act & Assert
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual({
      type: "Unknown",
      message: errorMessage,
    });

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenCalledWith("list_notes", {
      directoryPath,
    });
  });

  it("should throw formatted error when Tauri command fails with structured error", async () => {
    // Arrange
    const directoryPath = "/restricted/path";
    const structuredError: AppError = {
      type: "PermissionDenied",
      message: "Access denied to directory",
    };
    mockInvoke.mockRejectedValue(structuredError);

    // Act & Assert
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual(
      structuredError
    );

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenCalledWith("list_notes", {
      directoryPath,
    });
  });

  it("should handle error object with only message property", async () => {
    // Arrange
    const directoryPath = "/test/path";
    const errorObj = { message: "Something went wrong" };
    mockInvoke.mockRejectedValue(errorObj);

    // Act & Assert
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual({
      type: "Unknown",
      message: "Something went wrong",
    });
  });

  it("should handle completely unknown error types", async () => {
    // Arrange
    const directoryPath = "/test/path";
    const unknownError = { someProperty: "unknown" };
    mockInvoke.mockRejectedValue(unknownError);

    // Act & Assert
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual({
      type: "Unknown",
      message: "An unknown error occurred",
    });
  });

  it("should handle null/undefined errors", async () => {
    // Arrange
    const directoryPath = "/test/path";

    // Test null error
    mockInvoke.mockRejectedValue(null);
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual({
      type: "Unknown",
      message: "An unknown error occurred",
    });

    // Test undefined error
    mockInvoke.mockRejectedValue(undefined);
    await expect(FileApi.listNotes(directoryPath)).rejects.toEqual({
      type: "Unknown",
      message: "An unknown error occurred",
    });
  });

  it("should preserve all NoteInfo properties in response", async () => {
    // Arrange
    const directoryPath = "/test/folder";
    const detailedNoteInfo: NoteInfo = {
      path: "/test/folder/detailed-note.md",
      title: "Detailed Note with Special Characters: äöü",
      size: 4096,
      modified_at: "1703510400",
      is_directory: false,
    };
    mockInvoke.mockResolvedValue([detailedNoteInfo]);

    // Act
    const result = await FileApi.listNotes(directoryPath);

    // Assert
    expect(result).toHaveLength(1);
    const note = result[0];
    expect(note.path).toBe(detailedNoteInfo.path);
    expect(note.title).toBe(detailedNoteInfo.title);
    expect(note.size).toBe(detailedNoteInfo.size);
    expect(note.modified_at).toBe(detailedNoteInfo.modified_at);
    expect(note.is_directory).toBe(detailedNoteInfo.is_directory);
  });

  it("should handle notes with missing optional properties", async () => {
    // Arrange
    const directoryPath = "/test/folder";
    const noteWithoutOptionalProps: NoteInfo = {
      path: "/test/folder/minimal-note.md",
      title: "Minimal Note",
      size: 512,
      is_directory: false,
      // modified_at is optional and omitted
    };
    mockInvoke.mockResolvedValue([noteWithoutOptionalProps]);

    // Act
    const result = await FileApi.listNotes(directoryPath);

    // Assert
    expect(result).toHaveLength(1);
    const note = result[0];
    expect(note.path).toBe(noteWithoutOptionalProps.path);
    expect(note.title).toBe(noteWithoutOptionalProps.title);
    expect(note.size).toBe(noteWithoutOptionalProps.size);
    expect(note.is_directory).toBe(noteWithoutOptionalProps.is_directory);
    expect(note.modified_at).toBeUndefined();
  });
});
