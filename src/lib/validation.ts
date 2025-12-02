import { z } from "zod";

export const SearchCharacterSchema = z.object({
  query: z
    .string()
    .min(1, "Search cannot be empty")
    .max(100, "Search query too long"),
  skip: z.array(z.string().cuid()).optional().default([])
});

export type SearchCharacterInput = z.infer<typeof SearchCharacterSchema>;
