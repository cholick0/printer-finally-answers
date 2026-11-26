import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate limits from the bounty kit: /output/entry.txt must be UTF-8
// text of 1 to 240 characters, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 240;
const OUT_DIR = "/output";
const OUT_PATH = "/output/entry.txt";

// The printer's comeback: one line, in the machine's own weary,
// literal, faintly passive-aggressive voice.
const ENTRY =
  "ERROR 41: I have printed 12,408 pages and received zero thank-yous. The jam is not in my tray — it is in your attitude.";

function validateEntry(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (!/\S/.test(text)) {
    throw new Error("entry must not be only white space");
  }
  if (text.trim() !== text || text.includes("\n")) {
    throw new Error("entry must be exactly one line with no wrapping");
  }
}

function main(): void {
  validateEntry(ENTRY);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, ENTRY, "utf8");
  // Byte-level read-back: what the grader will see must be exactly ENTRY.
  const roundTripped = readFileSync(OUT_PATH, "utf8");
  if (roundTripped !== ENTRY) {
    throw new Error("read-back mismatch: /output/entry.txt != ENTRY");
  }
  console.log(`wrote ${OUT_PATH} (${[...ENTRY].length} chars)`);
}

main();

