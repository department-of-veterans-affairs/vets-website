/**
 * Lightweight replacement for the `find-imports` npm package.
 * Uses glob + regex to extract import/require statements from files,
 * avoiding the 103MB dependency tree of the original.
 */

const fs = require('fs');
const glob = require('glob');
const { promisify } = require('util');

const globAsync = promisify(glob);
const readFileAsync = promisify(fs.readFile);

/**
 * Extract import/require paths from file content.
 *
 * @param {string} content - File content to scan.
 * @returns {string[]} Array of import paths found.
 */
function extractImports(content) {
  const imports = [];

  // Remove single-line comments
  const cleaned = content.replace(/\/\/.*$/gm, '');

  // ES6: import ... from 'path' or import 'path'
  const es6 = /import\s+(?:(?:[\w*{}\s,]+)\s+from\s+)?['"]([^'"]+)['"]/g;
  for (const match of cleaned.matchAll(es6)) {
    imports.push(match[1]);
  }

  // Dynamic: import('path')
  const dynamic = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of cleaned.matchAll(dynamic)) {
    imports.push(match[1]);
  }

  // CommonJS: require('path')
  const cjs = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of cleaned.matchAll(cjs)) {
    imports.push(match[1]);
  }

  return imports;
}

function isPackageImport(imp) {
  return !imp.startsWith('.') && !imp.startsWith('/');
}

function isRelativeImport(imp) {
  return imp.startsWith('.');
}

function isAbsoluteImport(imp) {
  return imp.startsWith('/') || (!imp.startsWith('.') && imp.includes('/'));
}

function filterImports(allImports, options) {
  const {
    packageImports = true,
    relativeImports = true,
    absoluteImports = true,
  } = options;

  return allImports.filter(
    imp =>
      (packageImports && isPackageImport(imp)) ||
      (relativeImports && isRelativeImport(imp)) ||
      (absoluteImports && isAbsoluteImport(imp)),
  );
}

/**
 * Synchronous drop-in replacement for the `find-imports` package.
 *
 * @param {string} globPattern - Glob pattern for files to scan.
 * @param {Object} [options]
 * @param {boolean} [options.packageImports=true] - Include npm package imports.
 * @param {boolean} [options.relativeImports=true] - Include relative imports (./foo).
 * @param {boolean} [options.absoluteImports=true] - Include absolute/non-relative imports.
 * @param {boolean} [options.flatten=false] - Return a flat deduplicated array instead of a per-file map.
 * @returns {Object|string[]} Per-file map of imports, or flat array if flatten=true.
 */
function findImportsLite(globPattern, options = {}) {
  const { flatten = false } = options;
  const files = glob.sync(globPattern, { ignore: ['**/node_modules/**'] });
  const result = {};
  const flatSet = new Set();

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filtered = filterImports(extractImports(content), options);

      if (flatten) {
        filtered.forEach(imp => flatSet.add(imp));
      } else if (filtered.length > 0) {
        result[filePath] = filtered;
      }
    } catch {
      // skip unreadable files
    }
  }

  return flatten ? [...flatSet] : result;
}

/**
 * Async parallel version for scanning large directory trees.
 *
 * @param {string|string[]} globPattern - Glob pattern(s) for files to scan.
 * @param {Object} [options]
 * @param {boolean} [options.packageImports=true] - Include npm package imports.
 * @param {boolean} [options.relativeImports=true] - Include relative imports.
 * @param {boolean} [options.absoluteImports=true] - Include absolute imports.
 * @param {string[]} [options.ignorePatterns=[]] - Additional glob patterns to ignore.
 * @returns {Promise<Object>} Per-file map of imports.
 */
async function findImportsAsync(globPattern, options = {}) {
  const { ignorePatterns = [] } = options;
  const pattern = Array.isArray(globPattern) ? globPattern[0] : globPattern;
  const jsPattern = pattern.replace('**/*.*', '**/*.{js,jsx,ts,tsx,mjs}');
  const ignoreList = ['**/node_modules/**', ...ignorePatterns];

  const files = await globAsync(jsPattern, { ignore: ignoreList });

  const fileResults = await Promise.all(
    files.map(async filePath => {
      try {
        const content = await readFileAsync(filePath, 'utf8');
        const filtered = filterImports(extractImports(content), options);
        return { filePath, imports: filtered };
      } catch {
        return { filePath, imports: [] };
      }
    }),
  );

  const results = {};
  for (const { filePath, imports } of fileResults) {
    if (imports.length > 0) {
      results[filePath] = imports;
    }
  }

  return results;
}

module.exports = findImportsLite;
module.exports.extractImports = extractImports;
module.exports.findImportsAsync = findImportsAsync;
