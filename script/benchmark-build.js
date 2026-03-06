#!/usr/bin/env node

/**
 * Benchmark cold builds: webpack vs esbuild.
 *
 * Runs both build tools with the same entry points and reports timing,
 * output sizes, and file counts for comparison.
 *
 * Usage:
 *   node script/benchmark-build.js [options]
 *
 * Options:
 *   --entry=<apps>       Comma-separated list of app entry names (default: all)
 *   --buildtype=<type>   Build type (default: localhost)
 *   --runs=<n>           Number of runs per tool for averaging (default: 1)
 *   --skip-webpack       Only run esbuild
 *   --skip-esbuild       Only run webpack
 */

/* eslint-disable no-console */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value === undefined ? true : value;
  }
});

const entry = options.entry || '';
const buildtype = options.buildtype || 'localhost';
const runs = parseInt(options.runs || '1', 10);
const skipWebpack = options['skip-webpack'] === true;
const skipEsbuild = options['skip-esbuild'] === true;

const rootDir = path.resolve(__dirname, '..');

function clearBuildDir(destination) {
  const buildDir = path.join(rootDir, 'build', destination);
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
}

function clearCaches() {
  // Clear webpack caches
  const webpackCache = path.join(rootDir, '.cache/webpack');
  if (fs.existsSync(webpackCache)) {
    fs.rmSync(webpackCache, { recursive: true, force: true });
  }

  const babelCache = path.join(rootDir, '.babelcache');
  if (fs.existsSync(babelCache)) {
    fs.rmSync(babelCache, { recursive: true, force: true });
  }
}

function getDirSize(dir) {
  if (!fs.existsSync(dir)) return { size: 0, files: 0 };

  let totalSize = 0;
  let fileCount = 0;

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    entries.forEach(e => {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else {
        totalSize += fs.statSync(full).size;
        fileCount += 1;
      }
    });
  }

  walk(dir);
  return { size: totalSize, files: fileCount };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
}

function runWebpackBuild() {
  const entryArg = entry ? `--env entry=${entry}` : '';
  const cmd = `NODE_OPTIONS='--max-old-space-size=20480 --openssl-legacy-provider' webpack --config config/webpack.config.js --env buildtype=${buildtype} ${entryArg}`;

  const start = Date.now();
  execSync(cmd, {
    cwd: rootDir,
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: buildtype === 'vagovprod' ? 'production' : process.env.NODE_ENV,
    },
  });
  return Date.now() - start;
}

function runEsbuildBuild() {
  const entryArg = entry ? `--entry=${entry}` : '';
  const cmd = `node script/esbuild.js --buildtype=${buildtype} ${entryArg}`;

  const start = Date.now();
  execSync(cmd, { cwd: rootDir, stdio: 'pipe', env: { ...process.env } });
  return Date.now() - start;
}

async function benchmark() {
  console.log('='.repeat(60));
  console.log('  Build Benchmark: webpack vs esbuild');
  console.log('='.repeat(60));
  console.log(`  buildtype:  ${buildtype}`);
  console.log(`  entry:      ${entry || '(all)'}`);
  console.log(`  runs:       ${runs}`);
  console.log('');

  const results = { webpack: [], esbuild: [] };
  const outputInfo = { webpack: null, esbuild: null };

  // Run webpack benchmark
  if (!skipWebpack) {
    console.log('  Running webpack builds...');
    for (let i = 0; i < runs; i++) {
      clearCaches();
      const dest = `benchmark-webpack`;
      clearBuildDir(dest);
      process.env.BENCHMARK_DEST = dest;

      try {
        const elapsed = runWebpackBuild();
        results.webpack.push(elapsed);
        console.log(`    Run ${i + 1}: ${(elapsed / 1000).toFixed(2)}s`);

        if (i === runs - 1) {
          outputInfo.webpack = getDirSize(
            path.join(rootDir, 'build', buildtype, 'generated'),
          );
        }
      } catch (err) {
        console.error(`    Run ${i + 1}: FAILED`);
        console.error(err.stderr?.toString().slice(0, 500));
        results.webpack.push(null);
      }
    }
  }

  // Run esbuild benchmark
  if (!skipEsbuild) {
    console.log('  Running esbuild builds...');
    for (let i = 0; i < runs; i++) {
      clearCaches();
      const dest = `benchmark-esbuild`;
      clearBuildDir(dest);

      try {
        const elapsed = runEsbuildBuild();
        results.esbuild.push(elapsed);
        console.log(`    Run ${i + 1}: ${(elapsed / 1000).toFixed(2)}s`);

        if (i === runs - 1) {
          outputInfo.esbuild = getDirSize(
            path.join(rootDir, 'build', buildtype, 'generated'),
          );
        }
      } catch (err) {
        console.error(`    Run ${i + 1}: FAILED`);
        console.error(err.stderr?.toString().slice(0, 500));
        results.esbuild.push(null);
      }
    }
  }

  // Report
  console.log(`\n${'='.repeat(60)}`);
  console.log('  Results');
  console.log('='.repeat(60));

  const avg = arr => {
    const valid = arr.filter(x => x !== null);
    return valid.length
      ? valid.reduce((a, b) => a + b, 0) / valid.length
      : null;
  };

  if (!skipWebpack) {
    const webpackAvg = avg(results.webpack);
    console.log(`\n  webpack:`);
    console.log(
      `    Average time:  ${
        webpackAvg ? `${(webpackAvg / 1000).toFixed(2)}s` : 'N/A'
      }`,
    );
    if (outputInfo.webpack) {
      console.log(`    Output size:   ${formatBytes(outputInfo.webpack.size)}`);
      console.log(`    Output files:  ${outputInfo.webpack.files}`);
    }
  }

  if (!skipEsbuild) {
    const esbuildAvg = avg(results.esbuild);
    console.log(`\n  esbuild:`);
    console.log(
      `    Average time:  ${
        esbuildAvg ? `${(esbuildAvg / 1000).toFixed(2)}s` : 'N/A'
      }`,
    );
    if (outputInfo.esbuild) {
      console.log(`    Output size:   ${formatBytes(outputInfo.esbuild.size)}`);
      console.log(`    Output files:  ${outputInfo.esbuild.files}`);
    }
  }

  if (!skipWebpack && !skipEsbuild) {
    const webpackAvg = avg(results.webpack);
    const esbuildAvg = avg(results.esbuild);
    if (webpackAvg && esbuildAvg) {
      const speedup = (webpackAvg / esbuildAvg).toFixed(1);
      console.log(`\n  Speedup: ${speedup}x faster with esbuild`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
}

benchmark().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
