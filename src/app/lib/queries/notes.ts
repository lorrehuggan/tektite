import { createMutation, createQuery } from "@tanstack/svelte-query";

import type { CreateNoteRequest } from "@/types/file";

import { FileApi } from "../utils/file";

export const useListNotesQuery = (directory: string) => {
  return createQuery(() => ({
    queryKey: ["notes", "list", directory],
    queryFn: () => FileApi.listNotes(directory),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }));
};

export const useNoteQuery = (filePath: string, enabled = true) => {
  return createQuery(() => ({
    queryKey: ["notes", "detail", filePath],
    queryFn: () => FileApi.readNote(filePath),
    enabled: enabled && !!filePath,
  }));
};

export const useCreateNoteMutation = () => {
  return createMutation(() => ({
    mutationFn: (request: CreateNoteRequest) => FileApi.createNote(request),
  }));
};

export const useWriteNoteMutation = () => {
  return createMutation(() => ({
    mutationFn: ({
      filePath,
      content,
    }: {
      filePath: string;
      content: string;
    }) => FileApi.writeNote(filePath, content),
  }));
};
