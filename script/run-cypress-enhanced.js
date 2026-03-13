#!/usr/bin/env node

/* eslint-disable no-console, no-continue, no-plusplus */

/**
 * Usage:
 *   yarn cy:run:auto --spec "src/applications/my-app/tests/e2e/test.cypress.spec.js"
 *   node script/run-cypress-enhanced.js --serve --no-retry --spec "..."
 *
 * cy:run:auto passes --serve --no-retry --no-video by default.
 *
 * What it does:
 *   - Starts a dev server on a free port, runs the test, stops the server
 *   - Checks dev server health before running
 *   - Prints a structured failure summary with errors, command log, and screenshots
 *   - Kills the process after 180s if it hangs
 *
 * Flags:
 *   --serve          Start and stop a dev server automatically
 *   --no-retry       Disable retries
 *   --no-video       Skip video recording
 *   --timeout N      Hard process timeout in seconds (default: 180)
 *   --no-timeout     Disable hard timeout
 *   --summary-only   Print summary only, suppress Cypress output
 *
 * All other args are forwarded to cypress run.
 */

const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');
const http = require('http');

const DEFAULT_TIMEOUT_SECONDS = 180;
const SERVE_COMPILE_TIMEOUT_MS = 120000; // 2 minutes to wait for webpack
const DEFAULT_CONFIG = path.resolve(__dirname, '../config/cypress.config.js');
const MANIFEST_CATALOG = path.resolve(
  __dirname,
  '../src/applications/manifest-catalog.json',
);
const REPO_ROOT = path.resolve(__dirname, '..');

// Helpers

// eslint-disable-next-line no-control-regex
const ANSI_ESCAPE = /\x1B\[[0-9;]*[a-zA-Z]/g;
// eslint-disable-next-line no-control-regex
const OSC_ESCAPE = /\x1B\][^\x07]*\x07/g;

function stripAnsi(str) {
  return str.replace(ANSI_ESCAPE, '').replace(OSC_ESCAPE, '');
}

// Parsing helpers

/**
 * Extract command log blocks printed by the enhanced support file.
 * Delimited by: --- FAILED: <title> ---\n...\n---
 */
function extractCommandLogs(text) {
  const blocks = [];
  const regex = /--- FAILED: (.+?) ---\n([\s\S]*?)(?=\n---\n)/g;
  let match = regex.exec(text);
  while (match !== null) {
    blocks.push({ testTitle: match[1], body: match[2].trim() });
    match = regex.exec(text);
  }
  return blocks;
}

/**
 * Extract stats from the spec reporter output.
 */
function extractStats(text) {
  const stats = {};
  const passing = text.match(/(\d+)\s+passing/);
  const failing = text.match(/(\d+)\s+failing/);
  const pending = text.match(/(\d+)\s+pending/);
  const duration = text.match(/passing\s+\(([^)]+)\)/);
  if (passing) stats.passing = parseInt(passing[1], 10);
  if (failing) stats.failing = parseInt(failing[1], 10);
  if (pending) stats.pending = parseInt(pending[1], 10);
  if (duration) [, stats.duration] = duration;
  return stats;
}

/**
 * Extract numbered failures from spec reporter output.
 */
function extractFailures(text) {
  const failures = [];
  const lines = text.split('\n');
  let current = null;
  let collecting = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    const start = trimmed.match(/^(\d+)\)\s+(.+)/);
    if (start) {
      if (current) failures.push(current);
      current = {
        number: parseInt(start[1], 10),
        title: start[2].replace(/:$/, ''),
        error: '',
        location: '',
      };
      collecting = true;
      continue;
    }

    if (current && collecting) {
      if (
        trimmed.match(/^\d+ passing/) ||
        trimmed.match(/^\d+ failing/) ||
        trimmed.match(/^\(Results\)/) ||
        trimmed.match(/^\(Screenshots\)/)
      ) {
        collecting = false;
        continue;
      }

      if (
        trimmed.match(
          /^(AssertionError|CypressError|Error|TypeError|ReferenceError|TestingLibraryElementError):/,
        ) ||
        trimmed.startsWith('Timed out retrying')
      ) {
        current.error += (current.error ? '\n' : '') + trimmed;
        continue;
      }

      if (trimmed.startsWith('at ') && !current.location) {
        current.location = trimmed;
        continue;
      }

      if (current.error && trimmed && !trimmed.startsWith('at ')) {
        current.error += `\n${trimmed}`;
      }
    }
  }

  if (current) failures.push(current);
  return failures;
}

/**
 * Recursively walk a directory and collect .png file paths.
 */
function walkDir(dir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else if (entry.name.endsWith('.png')) {
      results.push(full);
    }
  }
}

/**
 * Find screenshot paths in the output or on disk.
 */
function findScreenshots(text, startTime) {
  const shots = [];

  const outputLines = text.split('\n');
  for (const line of outputLines) {
    const m = line.match(/^\s*-\s+(\/\S+\.png)/);
    if (m) shots.push(m[1]);
  }

  for (const line of outputLines) {
    const m2 = line.match(/^Screenshot:\s+(.+\.png)$/);
    if (m2 && !shots.includes(m2[1])) shots.push(m2[1]);
  }

  if (shots.length === 0) {
    const dir = path.resolve(REPO_ROOT, 'cypress/screenshots');
    try {
      if (fs.existsSync(dir)) {
        const allPngs = [];
        walkDir(dir, allPngs);
        const cutoff = (startTime || Date.now()) - 300000;
        for (const png of allPngs) {
          const stat = fs.statSync(png);
          if (stat.mtimeMs >= cutoff) {
            shots.push(png);
          }
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  return shots;
}

// Spec to entryName resolver

function resolveEntryName(specPathArg) {
  if (!fs.existsSync(MANIFEST_CATALOG)) {
    return null;
  }

  const catalog = JSON.parse(fs.readFileSync(MANIFEST_CATALOG, 'utf-8'));
  const apps = catalog.applications || [];

  let normalized = specPathArg.replace(/\\/g, '/');
  if (path.isAbsolute(normalized)) {
    normalized = path.relative(REPO_ROOT, normalized).replace(/\\/g, '/');
  }
  normalized = normalized.replace(/^\.\//, '');

  const appsByDir = new Map(apps.map(app => [app.directoryPath, app]));

  let dir = path.dirname(normalized).replace(/\\/g, '/');
  while (dir && dir !== '.' && dir !== 'src' && dir !== 'src/applications') {
    const match = appsByDir.get(dir);
    if (match) {
      return {
        entryName: match.entryName,
        rootUrl: match.rootUrl,
        appName: match.appName,
        directoryPath: match.directoryPath,
      };
    }
    dir = path.dirname(dir).replace(/\\/g, '/');
  }

  return null;
}

// Dev server health check

function checkDevServer(url) {
  return new Promise(resolve => {
    const req = http.get(url, res => {
      res.resume();
      resolve({ up: true, status: res.statusCode });
    });
    req.on('error', () => resolve({ up: false }));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ up: false });
    });
  });
}

// Ephemeral dev server (--serve)

/**
 * Find a free port by binding to port 0 and reading the assigned port.
 */
function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

/**
 * Start `yarn watch` on a given port for a given entryName.
 * Returns a promise that resolves when webpack reports "Compiled".
 * The returned object has { process, port, kill() }.
 */
function startDevServer(port, entryName) {
  return new Promise((resolve, reject) => {
    const args = [
      'watch',
      '--env',
      `entry=${entryName}`,
      '--env',
      `port=${port}`,
    ];

    console.log(`  Starting dev server: yarn ${args.join(' ')}`);
    console.log(`  Waiting for webpack compilation...`);

    const server = spawn('yarn', args, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });

    let output = '';
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(
          new Error(
            `Dev server did not compile within ${SERVE_COMPILE_TIMEOUT_MS /
              1000}s`,
          ),
        );
      }
    }, SERVE_COMPILE_TIMEOUT_MS);

    function onData(data) {
      const text = data.toString();
      output += text;
      // webpack-dev-server prints "Compiled successfully" or "Compiled with warnings"
      if (!settled && /Compiled\b/.test(stripAnsi(output))) {
        settled = true;
        clearTimeout(timeout);
        resolve({
          process: server,
          port,
          kill() {
            try {
              process.kill(-server.pid, 'SIGTERM');
            } catch (e) {
              server.kill('SIGTERM');
            }
          },
        });
      }
    }

    server.stdout.on('data', onData);
    server.stderr.on('data', onData);

    server.on('error', err => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(err);
      }
    });

    server.on('close', code => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(
          new Error(`Dev server exited with code ${code} before compiling`),
        );
      }
    });
  });
}

// Argument parsing

const rawArgs = process.argv.slice(2);
let timeoutSeconds = DEFAULT_TIMEOUT_SECONDS;
let quiet = false;
let serve = false;
let noRetry = false;
let noVideo = false;
let noTimeout = false;
let specPath = null;

const filteredArgs = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--timeout' && rawArgs[i + 1]) {
    timeoutSeconds = parseInt(rawArgs[i + 1], 10) || DEFAULT_TIMEOUT_SECONDS;
    i++;
  } else if (rawArgs[i] === '--summary-only') {
    quiet = true;
  } else if (rawArgs[i] === '--serve') {
    serve = true;
  } else if (rawArgs[i] === '--no-retry') {
    noRetry = true;
  } else if (rawArgs[i] === '--no-video') {
    noVideo = true;
  } else if (rawArgs[i] === '--no-timeout') {
    noTimeout = true;
  } else {
    if (rawArgs[i] === '--spec' && rawArgs[i + 1]) {
      specPath = rawArgs[i + 1];
    }
    filteredArgs.push(rawArgs[i]);
  }
}

// Build summary output

function buildDiagnostics({ clean, hardTimeoutFired, entryName }) {
  const diags = [];
  if (
    clean.includes('ECONNREFUSED') ||
    clean.includes('ERR_CONNECTION_REFUSED')
  ) {
    const cmd = entryName
      ? `yarn watch --env entry=${entryName}`
      : 'yarn watch --env entry=<app-name>';
    diags.push(`Dev server not running. Fix: ${cmd}`);
  }
  if (hardTimeoutFired) {
    diags.push(`Hard timeout (${timeoutSeconds}s). Process tree was killed.`);
  }
  if (clean.includes('Cannot find module')) {
    diags.push('Module not found — check import paths.');
  }
  if (clean.includes('Oops...we found an error preparing this test file')) {
    diags.push('Test file failed to compile. Check imports and syntax.');
  }
  return diags;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function buildSummary({
  code,
  hardTimeoutFired,
  stats,
  failures,
  commandLogs,
  screenshots,
  clean,
  totalTime,
  entryName,
}) {
  const out = [];
  out.push('');
  out.push('='.repeat(72));
  out.push('  SUMMARY');
  out.push('='.repeat(72));

  if (code === 0 && !hardTimeoutFired) {
    out.push('');
    out.push(
      `  PASSED | ${stats.passing || '?'} passing${
        stats.pending ? `, ${stats.pending} pending` : ''
      } (${stats.duration || `${totalTime}s`})`,
    );
    out.push('='.repeat(72));
    return out.join('\n');
  }

  out.push('');
  out.push(
    `  FAILED | ${stats.passing || 0} passing, ${stats.failing ||
      failures.length ||
      '?'} failing (${stats.duration || `${totalTime}s`})`,
  );

  if (!quiet && failures.length > 0) {
    out.push('');
    out.push('  FAILURES:');
    out.push(`  ${'-'.repeat(68)}`);
    failures.forEach(f => {
      out.push(`  ${f.number}) ${f.title}`);
      if (f.error) out.push(`     ${f.error.replace(/\n/g, '\n     ')}`);
      if (f.location) out.push(`     ${f.location}`);
      out.push('');
    });
  }

  if (commandLogs.length > 0) {
    out.push('  COMMAND LOG:');
    out.push(`  ${'-'.repeat(68)}`);
    commandLogs.forEach(block => {
      out.push('');
      out.push(`  [${block.testTitle}]`);

      if (quiet) {
        const errorLine = block.body
          .split('\n')
          .find(l => l.startsWith('Error:'));
        if (errorLine) {
          out.push(`  ${errorLine}`);
          out.push('');
        }
      }

      const cmdLines = block.body
        .split('\n')
        .filter(
          l =>
            !l.startsWith('Error:') &&
            l.trim() !== 'Command log:' &&
            !l.startsWith('Screenshot:'),
        );
      cmdLines.forEach(line => out.push(`  ${line}`));
    });
    out.push('');
  }

  if (clean.includes('Oops...we found an error preparing this test file')) {
    out.push('  BUILD ERROR:');
    out.push(`  ${'-'.repeat(68)}`);
    const buildLines = clean.split('\n');
    for (let i = 0; i < buildLines.length; i++) {
      if (buildLines[i].trim().startsWith('Oops...we found an error')) {
        const end = Math.min(i + 10, buildLines.length);
        for (let j = i; j < end; j++) {
          const bl = buildLines[j].trim();
          if (bl) out.push(`  ${bl}`);
        }
        break;
      }
    }
    out.push('');
  }

  if (screenshots.length > 0) {
    out.push('  SCREENSHOTS:');
    screenshots.forEach(s => out.push(`    ${s}`));
    out.push('');
  }

  const diags = buildDiagnostics({ clean, hardTimeoutFired, entryName });
  if (diags.length > 0) {
    out.push('  DIAGNOSTICS:');
    diags.forEach(d => out.push(`  - ${d}`));
    out.push('');
  }

  out.push('='.repeat(72));
  return out.join('\n');
}

// Run Cypress

function runCypress({ port, entryName }) {
  return new Promise(resolve => {
    const baseUrl = `http://127.0.0.1:${port}`;

    // Build dynamic config overrides
    const configOverrides = [`baseUrl=${baseUrl}`];
    if (noRetry) configOverrides.push('retries=0');
    if (noVideo) configOverrides.push('video=false');

    const cypressArgs = [
      'run',
      '--config-file',
      DEFAULT_CONFIG,
      '--browser',
      'chrome',
      '--headless',
      '--config',
      configOverrides.join(','),
      ...filteredArgs,
    ];

    let rawOutput = '';
    const startTime = Date.now();

    const child = spawn('npx', ['cypress', ...cypressArgs], {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
      env: {
        ...process.env,
        CYPRESS_EVERY_NTH_FRAME: '1',
        CYPRESS_FAILURE_HOOKS: '1',
        NO_COLOR: '1',
        FORCE_COLOR: '0',
      },
    });

    child.stdout.on('data', data => {
      const text = data.toString();
      rawOutput += text;
      if (!quiet) process.stdout.write(text);
    });

    child.stderr.on('data', data => {
      const text = data.toString();
      rawOutput += text;
      if (!quiet) process.stderr.write(text);
    });

    let hardTimeoutFired = false;
    const hardTimeout = noTimeout
      ? null
      : setTimeout(() => {
          hardTimeoutFired = true;
          process.stderr.write(
            `\nHARD TIMEOUT: Cypress exceeded ${timeoutSeconds}s — killing process tree.\n` +
              'Tip: increase with --timeout <seconds> or disable with --no-timeout\n',
          );
          try {
            process.kill(-child.pid, 'SIGKILL');
          } catch (e) {
            child.kill('SIGKILL');
          }
        }, timeoutSeconds * 1000);

    child.on('close', code => {
      if (hardTimeout) clearTimeout(hardTimeout);
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const clean = stripAnsi(rawOutput);

      const summary = buildSummary({
        code,
        hardTimeoutFired,
        stats: extractStats(clean),
        failures: extractFailures(clean),
        commandLogs: extractCommandLogs(clean),
        screenshots: findScreenshots(clean, startTime),
        clean,
        totalTime,
        entryName,
      });

      console.log(summary);
      resolve(code || 0);
    });

    child.on('error', err => {
      if (hardTimeout) clearTimeout(hardTimeout);
      console.error(`\nFailed to start Cypress: ${err.message}`);
      resolve(1);
    });
  });
}

// Main

async function main() {
  const resolved = specPath ? resolveEntryName(specPath) : null;
  const entryName = resolved ? resolved.entryName : null;
  const appName = resolved ? resolved.appName : null;

  // Print header
  const headerParts = [];
  if (entryName) headerParts.push(`entry: ${entryName}`);
  if (noRetry) headerParts.push('no retries');
  if (noVideo) headerParts.push('no video');
  if (noTimeout) headerParts.push('no timeout');
  else headerParts.push(`${timeoutSeconds}s timeout`);
  if (serve) headerParts.push('managed server');

  // --serve mode: start our own dev server on a free port
  if (serve) {
    if (!entryName) {
      console.error('');
      console.error(
        '  ERROR: --serve requires a --spec path that maps to an app in manifest-catalog.json',
      );
      console.error('');
      process.exit(1);
    }

    console.log(`\n--- Cypress Enhanced Runner (${headerParts.join(', ')}) ---\n`);

    let server;
    try {
      const port = await findFreePort();
      console.log(`  Port: ${port}`);
      server = await startDevServer(port, entryName);
      console.log(`  Dev server ready on port ${server.port}\n`);

      const exitCode = await runCypress({ port: server.port, entryName });

      console.log('\n  Stopping dev server...');
      server.kill();
      process.exit(exitCode);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
      if (server) server.kill();
      process.exit(1);
    }
    return;
  }

  // Default mode: check for existing dev server on port 3001
  const health = await checkDevServer('http://127.0.0.1:3001');

  if (!health.up) {
    const watchCmd = entryName
      ? `yarn watch --env entry=${entryName}`
      : 'yarn watch --env entry=<app-name>';

    console.error('');
    console.error('='.repeat(72));
    console.error('  ERROR: Dev server is not running on port 3001');
    console.error('='.repeat(72));
    console.error('');
    console.error('  Cypress needs a dev server to serve the app bundles.');
    console.error(
      '  Without it, tests will fail with "element not found" errors.',
    );
    console.error('');
    if (entryName) {
      console.error(`  Detected app: ${appName || entryName}`);
      console.error(`  Entry name:   ${entryName}`);
      console.error('');
    }
    console.error('  Start the dev server:');
    console.error(`    ${watchCmd}`);
    console.error('');
    console.error('  Or use --serve to start one automatically:');
    console.error(`    yarn cy:run --serve --spec "..."`);
    console.error('');
    console.error('='.repeat(72));
    console.error('');
    process.exit(1);
  }

  process.stdout.write(
    `\n--- Cypress Enhanced Runner (${headerParts.join(', ')}) ---\n\n`,
  );

  const exitCode = await runCypress({ port: 3001, entryName });
  process.exit(exitCode);
}

// Run
main();
