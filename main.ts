// One-Line Laugh-Off entry runner.
// Reads entry.txt next to this file, validates it, and copies it byte-for-byte
// into the output directory (MAKEFUN_OUTPUT_DIR, default /output).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  // Resolve entry.txt relative to this file, never relative to the CWD.
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(here, "entry.txt");

  let raw: Buffer;
  try {
    raw = await readFile(sourcePath);
  } catch (err) {
    fail(`cannot read ${sourcePath}: ${(err as Error).message}`);
  }

  // Decode as strict UTF-8: invalid sequences must fail loudly, not be
  // silently replaced.
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  } catch {
    fail(`${sourcePath} is not valid UTF-8`);
  }

  // Validate: exactly one line, 1-200 characters, not blank, and no stray
  // leading/trailing whitespace (a padded line would still pass the gate
  // but reads worse and wastes the economy the judge scores on).
  if (text.includes("\r") || text.includes("\n")) {
    fail("entry must be exactly one line (no CR or LF characters)");
  }
  if (text !== text.trim()) {
    fail("entry must not start or end with whitespace");
  }
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    fail(`entry must be 1-200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    fail("entry must not be empty or whitespace-only");
  }

  // Write the raw bytes unchanged into the output directory. An env var
  // set to an empty string counts as unset, so it falls back to /output.
  // Any filesystem failure here is reported as a clean error, not a stack
  // trace, so a broken output path is obvious at a glance.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
  const outPath = join(outDir, "entry.txt");
  try {
    await mkdir(outDir, { recursive: true });
    await writeFile(outPath, raw);
  } catch (err) {
    fail(`cannot write ${outPath}: ${(err as Error).message}`);
  }

  // Read the output back and confirm it matches the source byte for byte.
  // Comparing lengths first makes a truncation obvious in the message.
  let written: Buffer;
  try {
    written = await readFile(outPath);
  } catch (err) {
    fail(`cannot read back ${outPath}: ${(err as Error).message}`);
  }
  if (written.length !== raw.length || !written.equals(raw)) {
    fail(
      `${outPath} (${written.length} bytes) does not match ${sourcePath} (${raw.length} bytes) byte for byte`,
    );
  }

  console.log(`source: ${sourcePath}`);
  console.log(`output: ${outPath}`);
  console.log(`characters: ${chars}`);
  console.log(`bytes: ${raw.length}`);
  console.log(`entry: ${text}`);
}

main().catch((err: unknown) => {
  fail(err instanceof Error ? err.message : String(err));
});
