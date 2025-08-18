#!/usr/bin/env node
/* find-network-apis.js */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'src';
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const patterns = {
  fetch: /\b(?:global\.)?fetch\s*\(/,
  xhr: /\bnew\s+XMLHttpRequest\s*\(/,
  axios: /\b(?:import\s+axios\b|require\(['"]axios['"]\)|axios\.)/,
  undici: /\bfrom\s+['"]undici['"]|require\(['"]undici['"]\)/,
  nodeFetch: /from\s+['"]node-fetch['"]|require\(['"]node-fetch['"]\)/,
  got: /\bfrom\s+['"]got['"]|require\(['"]got['"]\)/,
  http: /require\(['"]http['"]\)|require\(['"]https['"]\)/,
};

const hits = Object.fromEntries(Object.keys(patterns).map(k => [k, []]));

function analyze(file) {
  const txt = fs.readFileSync(file, 'utf8');
  for (const [key, re] of Object.entries(patterns)) {
    if (re.test(txt)) hits[key].push(file);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (EXTS.has(path.extname(e.name))) analyze(p);
  }
}

walk(ROOT);

// Summary
const used = Object.entries(hits)
  .filter(([, files]) => files.length)
  .map(([k, files]) => `${k}: ${files.length}`);

/* eslint-disable no-console */
console.log('Network API discovery summary:');
console.log(used.length ? `- ${used.join('\n- ')}` : '- none found');
process.env.NETWORK_API_DISCOVERY_JSON = JSON.stringify(hits);
console.log('\nTip: enable only these patches based on what’s used.');
