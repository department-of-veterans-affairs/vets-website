#!/usr/bin/env node

/**
 * CLI entry point for esbuild builds.
 *
 * Usage:
 *   node script/esbuild.js [options]
 *
 * Options:
 *   --buildtype=<type>   localhost | vagovdev | vagovstaging | vagovprod
 *   --entry=<apps>       Comma-separated list of app entry names to build
 *   --api=<url>          API URL override
 *   --destination=<dir>  Output directory name (defaults to buildtype)
 *   --watch              Enable watch mode with live reload
 *   --scaffold           Generate HTML scaffold pages
 */

/* eslint-disable no-console */

const { runBuild } = require('../config/esbuild.config');

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--env' && args[i + 1]) {
    // webpack-style: --env entry=medications
    const [key, value] = args[i + 1].split('=');
    options[key] = value === undefined ? true : value;
    i += 1; // skip next arg
  } else if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value === undefined ? true : value;
  }
}

// Map to build options
const buildOptions = {
  buildtype: options.buildtype || 'localhost',
  entry: options.entry || undefined,
  api: options.api || '',
  destination: options.destination || options.buildtype || 'localhost',
  watch: options.watch || false,
};

runBuild(buildOptions).catch(err => {
  console.error('esbuild failed:', err);
  process.exit(1);
});
