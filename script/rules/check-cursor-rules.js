// scripts/check-cursor-rules.js
// Mirrors .github/copilot-instructions.md → .cursor/rules/copilot-instructions.mdc

/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

const SRC = '.github/copilot-instructions.md';
const DEST = '.cursor/rules/copilot-instructions.mdc';
const REPO_ROOT = process.cwd(); // assumes script runs at repo root

(async () => {
  // ── 1  abort if Copilot prompt is missing ─────────────────────
  try {
    await fs.access(SRC);
  } catch {
    return;
  }

  const copilot = await fs.readFile(SRC, 'utf8');

  // ── 2  basic safety guard: no symlinks / path-traversal ───────
  const absDest = path.resolve(DEST);
  if (!absDest.startsWith(REPO_ROOT)) {
    throw new Error('Refusing to write outside repository root');
  }
  const dirStat = await fs.lstat(path.dirname(DEST)).catch(() => null);
  const fileStat = await fs.lstat(DEST).catch(() => null);
  if (
    (dirStat && dirStat.isSymbolicLink()) ||
    (fileStat && fileStat.isSymbolicLink())
  ) {
    throw new Error('Destination is a symlink – aborting');
  }

  // ── 3  write only if content differs ──────────────────────────
  const existing = await fs.readFile(DEST, 'utf8').catch(() => '');
  if (existing === copilot) {
    return; // already in sync → exit 0
  }

  await fs.mkdir(path.dirname(DEST), { recursive: true });
  await fs.writeFile(DEST, copilot, { mode: 0o644 });
  console.log(`${existing ? 'Updated' : 'Created'} ${DEST}`);
  process.exit(42); // signal “changed”
})().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
