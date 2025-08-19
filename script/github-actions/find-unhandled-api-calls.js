#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const unitFile = path.join(repo, 'unhandled-http.unit.json');
const e2eJson = path.join(repo, 'unhandled-http.e2e.json');
const e2eJsonl = path.join(repo, 'unhandled-http.e2e.jsonl');

// These helpers avoid GHA breaking on certain characters
const esc = s =>
  String(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');

function firstRepoFrame(stack) {
  if (!stack) return null;
  const rx = /\(?(.+?):(\d+):(\d+)\)?$/;
  for (const line of String(stack).split('\n')) {
    if (line.includes(repo)) {
      const m = line.match(rx);
      if (m) return { file: m[1], line: Number(m[2]), col: Number(m[3]) };
    }
  }

  return null;
}

function readUnit() {
  try {
    if (!fs.existsSync(unitFile)) return [];
    const data = JSON.parse(fs.readFileSync(unitFile, 'utf8'));
    return Array.isArray(data.events) ? data.events : [];
  } catch {
    return [];
  }
}

function readE2E() {
  try {
    if (fs.existsSync(e2eJsonl)) {
      return fs
        .readFileSync(e2eJsonl, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map(l => JSON.parse(l))
        .map(x => ({
          time: x.time,
          transport: x.t || 'browser',
          method: x.m || 'GET',
          url: x.url,
          host: x.h,
          stack: '',
        }));
    }
    if (fs.existsSync(e2eJson)) {
      const d = JSON.parse(fs.readFileSync(e2eJson, 'utf8'));
      return Array.isArray(d) ? d : [];
    }
    return [];
  } catch {
    return [];
  }
}

const all = [...readUnit(), ...readE2E()];
const seen = new Set();
const unique = [];
for (const ev of all) {
  const key = `${ev.transport}|${ev.method}|${ev.url}`;
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(ev);
  }
}

console.log('::group::Unhandled network calls');
for (const ev of unique) {
  const msg = esc(
    `Unhandled network call: ${ev.method} ${ev.url} (via ${ev.transport})`,
  );
  const loc = firstRepoFrame(ev.stack);
  if (loc) {
    const file = esc(path.relative(repo, loc.file));
    const line = loc.line || 1;
    const col = loc.col || 1;
    console.log(`::warning file=${file},line=${line},col=${col}::${msg}`);
  } else {
    console.log(`::warning ::${msg}`);
  }
}
console.log('::endgroup::');

try {
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    const lines = unique
      .map(ev => `- \`${ev.method}\` ${ev.url} _(via ${ev.transport})_`)
      .join('\n');
    fs.appendFileSync(
      summary,
      `### Unhandled network calls\n${lines || 'None'}\n`,
      'utf8',
    );
  }
} catch (err) {
  if (process.env.CI) {
    console.warn(
      `Could not write step summary: ${
        err && err.message ? err.message : String(err)
      }`,
    );
  }
}
