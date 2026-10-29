import path from "node:path";

import { describe, expect, it } from "vitest";

import { EnvError, parseEnv } from "./env";

// A hash of "correct horse" (scripts/hash-password.ts).
const PASSWORD_HASH = "argon2id:m=19456,t=2,p=1:CLZW5wQoCjh3Q9CHBp_JWw:Ak2xS7TYlYYrhemlgBkVxFmWXfcMq_rjd0mJGZcZFfA";

const valid = {
  BOUNCEBACK_PASSWORD: PASSWORD_HASH,
  BOUNCEBACK_SECRET: "a".repeat(32),
  DATABASE_URL: "postgresql://postgres:postgres@db:5432/bounceback",
};

function problems(source: Record<string, string | undefined>): string[] {
  try {
    parseEnv(source);
  } catch (error) {
    if (error instanceof EnvError) return error.problems;
    throw error;
  }
  throw new Error("Expected parseEnv to throw");
}

describe("parseEnv", () => {
  it("accepts the required variables and fills in defaults", () => {
    expect(parseEnv(valid)).toEqual({
      ...valid,
      BOUNCEBACK_DATA_DIR: "/data",
      BOUNCEBACK_BACKUP_RETENTION_DAYS: 14,
      BOUNCEBACK_TELEMETRY: undefined,
    });
  });

  it("reads whether the usage ping is on", () => {
    // Unset or empty: not decided, so Bounceback asks (#172).
    expect(parseEnv({ ...valid, BOUNCEBACK_TELEMETRY: "" }).BOUNCEBACK_TELEMETRY).toBeUndefined();
    expect(parseEnv(valid).BOUNCEBACK_TELEMETRY).toBeUndefined();
    expect(parseEnv({ ...valid, BOUNCEBACK_TELEMETRY: "ON" }).BOUNCEBACK_TELEMETRY).toBe("on");
    expect(parseEnv({ ...valid, BOUNCEBACK_TELEMETRY: " Off " }).BOUNCEBACK_TELEMETRY).toBe("off");
    expect(problems({ ...valid, BOUNCEBACK_TELEMETRY: "false" })).toEqual(['BOUNCEBACK_TELEMETRY must be on or off (got "false").']);
  });

  it("reads the optional variables", () => {
    const env = parseEnv({
      ...valid,
      BOUNCEBACK_DATA_DIR: "/srv/bounceback",
      BOUNCEBACK_BACKUP_RETENTION_DAYS: "30",
      BOUNCEBACK_AI_PROVIDER: "local",
      BOUNCEBACK_AI_URL: "http://ollama:11434",
      BOUNCEBACK_AI_MODEL: "llama3.1:8b",
      BOUNCEBACK_AI_KEY: "sk-test",
    });
    expect(env).toMatchObject({
      BOUNCEBACK_DATA_DIR: "/srv/bounceback",
      BOUNCEBACK_BACKUP_RETENTION_DAYS: 30,
      BOUNCEBACK_AI_PROVIDER: "local",
      BOUNCEBACK_AI_URL: "http://ollama:11434",
      BOUNCEBACK_AI_MODEL: "llama3.1:8b",
      BOUNCEBACK_AI_KEY: "sk-test",
    });
  });

  it("reads the AI timeout in seconds", () => {
    expect(parseEnv({ ...valid, BOUNCEBACK_AI_TIMEOUT_SECONDS: " 300 " }).BOUNCEBACK_AI_TIMEOUT_SECONDS).toBe(300);
    expect(() => parseEnv({ ...valid, BOUNCEBACK_AI_TIMEOUT_SECONDS: "5m" })).toThrow(/whole number of seconds/);
    expect(() => parseEnv({ ...valid, BOUNCEBACK_AI_TIMEOUT_SECONDS: "1" })).toThrow(/at least 5/);
  });

  it("resolves a relative data directory", () => {
    const env = parseEnv({ ...valid, BOUNCEBACK_DATA_DIR: "./data" });
    expect(env.BOUNCEBACK_DATA_DIR).toBe(path.resolve("data"));
  });

  it("treats empty values as unset", () => {
    const env = parseEnv({ ...valid, BOUNCEBACK_AI_KEY: "", BOUNCEBACK_DATA_DIR: " " });
    expect(env.BOUNCEBACK_AI_KEY).toBeUndefined();
    expect(env.BOUNCEBACK_DATA_DIR).toBe("/data");
    expect(problems({ ...valid, BOUNCEBACK_PASSWORD: "" })).toEqual([
      expect.stringMatching(/^BOUNCEBACK_PASSWORD is not set\./),
    ]);
  });

  it("names every missing required variable", () => {
    expect(problems({})).toEqual([
      expect.stringMatching(/^BOUNCEBACK_PASSWORD is not set\. Set it to/),
      expect.stringMatching(/^BOUNCEBACK_SECRET is not set\. .*openssl rand/),
      expect.stringMatching(/^DATABASE_URL is not set\. /),
    ]);
  });

  it("wants a hash of the password, not the password itself", () => {
    expect(problems({ ...valid, BOUNCEBACK_PASSWORD: "correct horse" })).toEqual([
      expect.stringMatching(/^BOUNCEBACK_PASSWORD must be a hash of your password, not the password itself\. .*hash-password/),
    ]);
    expect(parseEnv({ ...valid, BOUNCEBACK_PASSWORD: ` ${PASSWORD_HASH}\n` }).BOUNCEBACK_PASSWORD).toBe(PASSWORD_HASH);
  });

  it("rejects a secret shorter than 32 characters", () => {
    expect(problems({ ...valid, BOUNCEBACK_SECRET: "short" })).toEqual([
      expect.stringMatching(/^BOUNCEBACK_SECRET is too short \(5 characters\)\./),
    ]);
  });

  it("never echoes secret values", () => {
    const messages = problems({
      BOUNCEBACK_PASSWORD: "hunter2",
      BOUNCEBACK_SECRET: "tiny-secret",
      DATABASE_URL: "mysql://root:db-password@db/bounceback",
    }).join("\n");
    expect(messages).not.toContain("hunter2");
    expect(messages).not.toContain("tiny-secret");
    expect(messages).not.toContain("db-password");
    expect(messages).toMatch(/DATABASE_URL must be a PostgreSQL connection string/);
  });

  it("rejects invalid optional values", () => {
    expect(
      problems({
        ...valid,
        BOUNCEBACK_BACKUP_RETENTION_DAYS: "two weeks",
        BOUNCEBACK_AI_PROVIDER: "gemini",
        BOUNCEBACK_AI_URL: "ftp://example.com",
      }),
    ).toEqual([
      'BOUNCEBACK_BACKUP_RETENTION_DAYS must be a whole number of days (got "two weeks").',
      'BOUNCEBACK_AI_PROVIDER must be one of local, openai, anthropic, mistral, lmstudio (got "gemini").',
      "BOUNCEBACK_AI_URL must be an http:// or https:// URL.",
    ]);
    expect(problems({ ...valid, BOUNCEBACK_BACKUP_RETENTION_DAYS: "0" })).toEqual([
      "BOUNCEBACK_BACKUP_RETENTION_DAYS must be at least 1.",
    ]);
  });
});

describe("job search variables (E14-4)", () => {
  it("reads the source and its keys", () => {
    expect(
      parseEnv({
        ...valid,
        BOUNCEBACK_JOBS_SOURCE: "jsearch",
        BOUNCEBACK_JSEARCH_KEY: "ak_test",
        BOUNCEBACK_JSEARCH_HOST: "rapidapi",
        BOUNCEBACK_ADZUNA_APP_ID: "app",
        BOUNCEBACK_ADZUNA_KEY: "adz",
      }),
    ).toMatchObject({
      BOUNCEBACK_JOBS_SOURCE: "jsearch",
      BOUNCEBACK_JSEARCH_KEY: "ak_test",
      BOUNCEBACK_JSEARCH_HOST: "rapidapi",
      BOUNCEBACK_ADZUNA_APP_ID: "app",
      BOUNCEBACK_ADZUNA_KEY: "adz",
    });
  });

  it("reads whether the Bundesagentur für Arbeit is offered, and refuses choosing it while it's off (#223)", () => {
    expect(parseEnv(valid).BOUNCEBACK_JOBS_ARBEITSAGENTUR).toBeUndefined();
    expect(parseEnv({ ...valid, BOUNCEBACK_JOBS_ARBEITSAGENTUR: " OFF " }).BOUNCEBACK_JOBS_ARBEITSAGENTUR).toBe("off");
    expect(problems({ ...valid, BOUNCEBACK_JOBS_ARBEITSAGENTUR: "no" })).toEqual(['BOUNCEBACK_JOBS_ARBEITSAGENTUR must be on or off (got "no").']);
    expect(problems({ ...valid, BOUNCEBACK_JOBS_SOURCE: "arbeitsagentur", BOUNCEBACK_JOBS_ARBEITSAGENTUR: "off" })).toEqual([
      "BOUNCEBACK_JOBS_SOURCE is arbeitsagentur, but BOUNCEBACK_JOBS_ARBEITSAGENTUR is off. Choose another source, or remove one of the two.",
    ]);
  });

  it("rejects sources and hosts it doesn't know, without echoing keys", () => {
    expect(problems({ ...valid, BOUNCEBACK_JOBS_SOURCE: "linkedin", BOUNCEBACK_JSEARCH_HOST: "google", BOUNCEBACK_JSEARCH_KEY: "ak_secret" })).toEqual([
      'BOUNCEBACK_JOBS_SOURCE must be one of jsearch, adzuna, arbeitsagentur, off (got "linkedin").',
      'BOUNCEBACK_JSEARCH_HOST must be openwebninja or rapidapi (got "google").',
    ]);
  });
});
