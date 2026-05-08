import "dotenv/config";

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid env var ${name}=${raw}: expected positive number`);
  }
  return n;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: int("PORT", 4000),
  maxUploadMb: int("MAX_UPLOAD_MB", 20),
} as const;

export const isProd = env.nodeEnv === "production";
