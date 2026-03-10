const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { execSync } = require('child_process');

// list of forms-system files changed in this PR
const files = (process.env.CHANGED_FILES || '')
  .split(' ')
  .filter(f => f.includes('platform/forms-system/'));

// make sure we set the path to vets-website
const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
  cwd: __dirname,
}).trim();

// max workers for each job
const MAX_WORKERS = 12;

// find all exports from changed forms-system files changed in this PR
function getExports() {
  const exports = [];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const ast = parser.parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'optionalChaining', 'nullishCoalescingOperator'],
    });

    traverse(ast, {
      ExportNamedDeclaration({ node }) {
        const { declaration, specifiers } = node;
        if (declaration?.declarations) {
          declaration.declarations.forEach(d => exports.push(d.id.name));
        } else if (declaration?.id) {
          exports.push(declaration.id.name);
        }
        specifiers?.forEach(s => exports.push(s.exported.name));
      },
      ExportDefaultDeclaration({ node }) {
        const { declaration } = node;
        exports.push(declaration.id ? declaration.id.name : 'default');
      },
    });
  }
  return exports;
}

// make sure that a file really imports something from forms-system
function checkFileHasFormSystemImports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'optionalChaining', 'nullishCoalescingOperator'],
  });

  let hasFormSystemImport = false;
  traverse(ast, {
    ImportDeclaration({ node }) {
      if (node.source.value.includes('forms-system')) {
        hasFormSystemImport = true;
      }
    },
  });

  return hasFormSystemImport;
}

// find files that import something from one of the files changed in the PR
function getFilesUsingExports() {
  const exports = getExports();
  const importingFiles = new Set();

  // first find files that might import a forms-system export by searching by name
  for (const _export of exports) {
    try {
      const hits = execSync(`git grep -l "${_export}" -- src`, {
        encoding: 'utf8',
        cwd: repoRoot,
      })
        .trim()
        .split('\n')
        .filter(Boolean);
      hits.forEach(hit => {
        // now verify the file does in fact import something from forms-system
        if (checkFileHasFormSystemImports(hit)) {
          importingFiles.add(hit);
        }
      });
    } catch (e) {
      // no match found
    }
  }

  return importingFiles;
}

// find the parent app folder
function findAppFolder(filePath) {
  let dir = path.dirname(filePath);

  const terminalDir = 'src/applications';

  while (!dir.endsWith(terminalDir)) {
    // possible path to app's manifest
    const manifestPath = path.join(repoRoot, dir, 'manifest.json');
    // we found it
    if (fs.existsSync(manifestPath)) {
      return dir;
    }

    const nextDir = path.dirname(dir);
    // we tried all parent dirs up to /applications but did not find manifest.json, so take app folder
    if (nextDir.endsWith(terminalDir)) {
      return dir;
    }
    dir = nextDir;
  }
  return null;
}

// find the parent platform folder
function findPlatformFolder(filePath) {
  const segments = filePath.split(path.sep);
  const idx = segments.indexOf('platform');
  return segments.slice(0, idx + 2).join(path.sep);
}

// find the folder that contains tests for a targeted app or platform folder
function findTestingFolder(filePath) {
  return filePath.includes('src/applications')
    ? findAppFolder(filePath)
    : findPlatformFolder(filePath);
}

// distribute apps evenly across max number of workers
function bucketFolders(apps, globSuffix) {
  const folderList = [...apps];
  const buckets = Array.from(
    { length: Math.min(folderList.length, MAX_WORKERS) },
    () => [],
  );
  folderList.forEach((folder, i) => buckets[i % buckets.length].push(folder));
  return buckets.map(b => b.map(f => `${f}/${globSuffix}`).join(','));
}

// Sets three GitHub Actions outputs:
// - folders: comma-separated list of app/platform folders (e.g. "src/applications/foo,src/platform/bar")
// - cypress_specs: JSON array of {index, spec} objects, bucketed across up to 12 workers for Cypress matrix
// - unit_test_specs: JSON array of {index, spec} objects, bucketed across up to 12 workers for unit test matrix
function getFoldersForTests() {
  const _files = getFilesUsingExports();
  const apps = new Set();
  _files.forEach(file => {
    const app = findTestingFolder(file);
    if (app) apps.add(app);
  });

  const cypressBuckets = bucketFolders(apps, '**/*.cypress.spec.{js,jsx}');
  const unitBuckets = bucketFolders(apps, '**/*.unit.spec.js?(x)');
  const folders = [...apps].join(',');
  const cypressSpecs = JSON.stringify(
    cypressBuckets.map((spec, i) => ({ index: i, spec })),
  );
  const unitTestSpecs = JSON.stringify(
    unitBuckets.map((spec, i) => ({ index: i, spec })),
  );

  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `folders=${folders}\ncypress_specs=${cypressSpecs}\nunit_test_specs=${unitTestSpecs}\n`,
  );
}

getFoldersForTests();
