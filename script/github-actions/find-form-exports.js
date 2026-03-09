const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { execSync } = require('child_process');

const files = (process.env.CHANGED_FILES || '')
  .split(' ')
  .filter(f => f.includes('platform/forms-system/'));

const repoRoot = execSync('git rev-parse --show-toplevel', {
  encoding: 'utf8',
  cwd: __dirname,
}).trim();

const MAX_WORKERS = 12;

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

// find files that import something from one of the files changed in the PR
function getFilesUsingExports() {
  const exports = getExports();
  // const exports = ['internationalPhoneSchema'];
  const importingFiles = new Set();

  for (const _export of exports) {
    try {
      const hits = execSync(`git grep -l "${_export}" -- src`, {
        encoding: 'utf8',
        cwd: repoRoot,
      })
        .trim()
        .split('\n')
        .filter(Boolean);
      hits.forEach(hit => importingFiles.add(hit));
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
    const manifestPath = path.join(repoRoot, dir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      return dir;
    }

    const nextDir = path.dirname(dir);
    // we got to end but did not find manifest.json so take app folder
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
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const dir = segments.slice(0, idx + 2).join(path.sep);
  return dir;
}

// find the folder that contains tests for an app or platform folder that contains a file that imports an export that may have been modified in PR
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

// return a comma-separated-list of app/platform folders for unit tests (all run in 1 worker)
// AND an array of comma-seperated-lists, one entry for each worker
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
