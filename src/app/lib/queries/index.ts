export * from "./notes";

export const queryKeys = {
  notes: {
    all: ["notes"] as const,
    list: (directory: string) =>
      [...queryKeys.notes.all, "list", directory] as const,
    detail: (filePath: string) =>
      [...queryKeys.notes.all, "detail", filePath] as const,
    info: (filePath: string) =>
      [...queryKeys.notes.all, "info", filePath] as const,
  },
} as const;
