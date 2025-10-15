#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * Parse TypeScript compiler stderr/stdout and emit GitHub Actions annotations.
 * Usage:
 *   yarn typecheck 2>&1 | node script/github-actions/ts-annotation-format.js
 * Or (preferred in workflow):
 *   yarn typecheck --pretty false > typecheck.out 2>&1 || true
 *   node script/github-actions/ts-annotation-format.js typecheck.out
 * Exits non‑zero if any errors were found, zero otherwise.
 */

const fs = require('fs');

const inputFile = process.argv[2];
let text = '';
if (inputFile) {
  try {
    text = fs.readFileSync(inputFile, 'utf8');
  } catch (e) {
    console.error(
      `::warning ::Could not read TypeScript output file ${inputFile}: ${e.message}`,
    );
  }
}
if (!text) {
  // read from stdin
  try {
    text = fs.readFileSync(0, 'utf8');
  } catch (_) {
    // ignore
  }
}

// tsc error line patterns (no pretty):
// path/to/file.ts(x)(line,col): error TS1234: message
const lineRegex =
  /^(?<file>[^()\n]+)\((?<line>\d+),(?<col>\d+)\): (?<level>error|warning) (?<code>TS\d+): (?<message>.*)$/;

let errorCount = 0;
let warnCount = 0;

text.split(/\r?\n/).forEach(rawLine => {
  const line = rawLine.trim();
  if (!line) return;
  const match = line.match(lineRegex);
  if (!match) return;
  const { file, line: l, col, level, code, message } = match.groups;
  const ghLevel = level === 'error' ? 'error' : 'warning';
  if (ghLevel === 'error') errorCount += 1;
  else warnCount += 1;
  const escapedMsg = message
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
  console.log(
    `::${ghLevel} file=${file},line=${l},col=${col},title=${code}::${escapedMsg}`,
  );
});

if (errorCount > 0) {
  console.error(
    `Found ${errorCount} TypeScript error(s) and ${warnCount} warning(s).`,
  );
  process.exit(1);
} else {
  console.log(`No TypeScript errors. Warnings: ${warnCount}.`);
}
