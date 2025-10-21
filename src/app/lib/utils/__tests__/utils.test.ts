import { describe, expect, it } from "vitest";

import { fileUtils } from "../file";

describe("fileUtils", () => {
  describe("getFileName", () => {
    it("should extract filename from unix path", () => {
      const result = fileUtils.getFileName("/path/to/file.md");
      expect(result).toBe("file.md");
    });

    it("should extract filename from windows path", () => {
      const result = fileUtils.getFileName("C:\\path\\to\\file.md");
      expect(result).toBe("file.md");
    });

    it("should return empty string for empty path", () => {
      const result = fileUtils.getFileName("");
      expect(result).toBe("");
    });
  });

  describe("isMarkdownFile", () => {
    it("should return true for .md files", () => {
      expect(fileUtils.isMarkdownFile("test.md")).toBe(true);
    });

    it("should return true for .markdown files", () => {
      expect(fileUtils.isMarkdownFile("test.markdown")).toBe(true);
    });

    it("should return false for non-markdown files", () => {
      expect(fileUtils.isMarkdownFile("test.txt")).toBe(false);
    });

    it("should be case insensitive", () => {
      expect(fileUtils.isMarkdownFile("test.MD")).toBe(true);
      expect(fileUtils.isMarkdownFile("test.MARKDOWN")).toBe(true);
    });
  });

  describe("titleToFileName", () => {
    it("should convert title to safe filename", () => {
      const result = fileUtils.titleToFileName("My Great Note");
      expect(result).toBe("my-great-note");
    });

    it("should remove special characters", () => {
      const result = fileUtils.titleToFileName("Note with @#$% symbols!");
      expect(result).toBe("note-with-symbols");
    });

    it("should handle empty string", () => {
      const result = fileUtils.titleToFileName("");
      expect(result).toBe("");
    });

    it("should trim whitespace", () => {
      const result = fileUtils.titleToFileName("  Spaced Title  ");
      expect(result).toBe("spaced-title");
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(fileUtils.formatFileSize(0)).toBe("0 Bytes");
      expect(fileUtils.formatFileSize(500)).toBe("500 Bytes");
    });

    it("should format kilobytes correctly", () => {
      expect(fileUtils.formatFileSize(1024)).toBe("1 KB");
      expect(fileUtils.formatFileSize(1536)).toBe("1.5 KB");
    });

    it("should format megabytes correctly", () => {
      expect(fileUtils.formatFileSize(1048576)).toBe("1 MB");
      expect(fileUtils.formatFileSize(1572864)).toBe("1.5 MB");
    });
  });

  describe("ensureMarkdownExtension", () => {
    it("should add .md extension if missing", () => {
      const result = fileUtils.ensureMarkdownExtension("filename");
      expect(result).toBe("filename.md");
    });

    it("should not add extension if already markdown", () => {
      const result = fileUtils.ensureMarkdownExtension("filename.md");
      expect(result).toBe("filename.md");
    });

    it("should handle .markdown extension", () => {
      const result = fileUtils.ensureMarkdownExtension("filename.markdown");
      expect(result).toBe("filename.markdown");
    });
  });
});
