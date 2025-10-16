# FileApi Tests

This directory contains tests for the FileApi utility class.

## Overview

The tests use Vitest as the testing framework, which provides excellent TypeScript support and works well with Vite-based projects like SvelteKit.

## Setup

To run the tests, you'll need to install the following dependencies:

```bash
bun add -D vitest jsdom @vitest/ui
```

## Running Tests

```bash
# Run tests once
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Test Structure

### FileApi.listNotes Tests

The `file.test.ts` file contains comprehensive tests for the `listNotes` method, covering:

- **Happy Path**: Successfully listing notes from a directory
- **Empty Directory**: Handling directories with no notes
- **Path Formats**: Testing different directory path formats (Windows, Unix, relative)
- **Error Handling**: Various error scenarios including:
  - String errors from Tauri
  - Structured AppError objects
  - Unknown error types
  - Null/undefined errors
- **Data Integrity**: Ensuring all NoteInfo properties are preserved
- **Optional Properties**: Handling notes with missing optional fields

## Mocking Strategy

The tests mock the Tauri `invoke` function to simulate backend responses without requiring the actual Rust backend to be running. This allows for:

- Fast test execution
- Predictable test results
- Easy error scenario testing
- No dependency on file system state

## Test Data

The tests use realistic mock data that matches the expected structure of `NoteInfo` objects returned by the Rust backend, including:

- File paths with various formats
- Realistic file sizes and timestamps
- Both files and directories
- Special characters in titles

## Error Testing

The error handling tests ensure that the `FileApi.handleError` method properly normalizes different error types into consistent `AppError` objects, maintaining type safety throughout the application.