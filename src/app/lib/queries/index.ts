export * from "./notes";

export const QUERY_KEYS = {
  notes: {
    all: ["notes"] as const,
    list: (directory: string) =>
      [...QUERY_KEYS.notes.all, "list", directory] as const,
    detail: (filePath: string) =>
      [...QUERY_KEYS.notes.all, "detail", filePath] as const,
    info: (filePath: string) =>
      [...QUERY_KEYS.notes.all, "info", filePath] as const,
  },
} as const;
