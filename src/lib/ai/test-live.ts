import { AiProvider } from "@/generated/prisma/enums";

import type { AiConfig } from "./config";

// For the live tests: they can use a key saved in the app instead of one
// given on the command line.

/**
 * What's saved in Settings → AI provider, key included, read the way the app
 * reads it: `.env` (BOUNCEBACK_SECRET decrypts the key), then the database.
 */
export async function savedAiConfig(): Promise<AiConfig> {
  // Keeps what's set already, such as the DATABASE_URL Compose gives the container.
  process.loadEnvFile(".env");
  const { loadAiConfig } = await import("./config");
  return loadAiConfig();
}

/** Mistral's key and model: BOUNCEBACK_AI_KEY (and BOUNCEBACK_AI_MODEL), or what's saved in Settings with Mistral chosen. */
export async function liveMistral(): Promise<{ key: string; model: string } | null> {
  const fallbackModel = "mistral-medium-latest";
  if (process.env.BOUNCEBACK_AI_KEY) return { key: process.env.BOUNCEBACK_AI_KEY, model: process.env.BOUNCEBACK_AI_MODEL ?? fallbackModel };
  const saved = await savedAiConfig();
  return saved.provider === AiProvider.MISTRAL && saved.apiKey ? { key: saved.apiKey, model: saved.model ?? fallbackModel } : null;
}

/** LM Studio's address, token and model: BOUNCEBACK_AI_MODEL (and BOUNCEBACK_AI_URL, BOUNCEBACK_AI_KEY), or what's saved in Settings with LM Studio chosen. */
export async function liveLmStudio(): Promise<{ url: string; key: string | null; model: string } | null> {
  const { BOUNCEBACK_AI_URL, BOUNCEBACK_AI_KEY, BOUNCEBACK_AI_MODEL } = process.env;
  if (BOUNCEBACK_AI_MODEL) return { url: BOUNCEBACK_AI_URL ?? "http://host.docker.internal:1234", key: BOUNCEBACK_AI_KEY ?? null, model: BOUNCEBACK_AI_MODEL };
  const saved = await savedAiConfig();
  return saved.provider === AiProvider.LMSTUDIO && saved.model ? { url: saved.baseUrl, key: saved.apiKey, model: saved.model } : null;
}
