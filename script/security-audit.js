/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const https = require('https');
const semver = require('semver');
const lockfile = require('@yarnpkg/lockfile');

const REGISTRY_HOST = 'registry.npmjs.org';
const BULK_ADVISORY_PATH = '/-/npm/v1/security/advisories/bulk';

const SEVERITY_FILTER = new Set(['low', 'moderate', 'high', 'critical']);

const EXCEPTION_SET = new Set([
  'https://npmjs.com/advisories/996',
  'https://npmjs.com/advisories/1488',
  'https://github.com/advisories/GHSA-r683-j2x4-v87g',
  'https://github.com/advisories/GHSA-8hfj-j24r-96c4',
]);

/**
 * Parse yarn.lock and return a map of package name -> { version, dependencies }.
 */
function parseYarnLock(lockPath) {
  const raw = fs.readFileSync(lockPath, 'utf8');
  const parsed = lockfile.parse(raw);

  if (parsed.type !== 'success') {
    throw new Error(`Failed to parse yarn.lock: ${parsed.type}`);
  }

  // Build a map of packageName -> { version, dependencies }
  const packages = {};
  for (const [key, entry] of Object.entries(parsed.object)) {
    // Key format: "package-name@^1.0.0" or "@scope/name@^1.0.0"
    const atIndex = key.lastIndexOf('@');
    const name = key.substring(0, atIndex);

    if (!packages[name]) {
      packages[name] = {
        version: entry.version,
        dependencies: entry.dependencies || {},
      };
    }
  }

  return packages;
}

/**
 * Build a set of all package names reachable from production dependencies.
 */
function getProductionReachable(productionDeps, allPackages) {
  const reachable = new Set();
  const queue = [...productionDeps];

  while (queue.length > 0) {
    const name = queue.pop();
    if (reachable.has(name)) continue;
    reachable.add(name);

    const pkg = allPackages[name];
    if (pkg && pkg.dependencies) {
      for (const dep of Object.keys(pkg.dependencies)) {
        if (!reachable.has(dep)) {
          queue.push(dep);
        }
      }
    }
  }

  return reachable;
}

/**
 * Query the npm bulk advisory API.
 */
function fetchAdvisories(packageVersions) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify(packageVersions));

    const req = https.request(
      {
        hostname: REGISTRY_HOST,
        path: BULK_ADVISORY_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': body.length,
        },
      },
      res => {
        let data = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(
              new Error(
                `Advisory API returned ${res.statusCode}: ${Buffer.concat(
                  data,
                ).toString()}`,
              ),
            );
            return;
          }
          try {
            resolve(JSON.parse(Buffer.concat(data).toString()));
          } catch (e) {
            reject(new Error(`Failed to parse advisory response: ${e.message}`));
          }
        });
      },
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(rootDir, 'package.json');
  const yarnLockPath = path.join(rootDir, 'yarn.lock');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const productionDeps = Object.keys(packageJson.dependencies || {});

  const allPackages = parseYarnLock(yarnLockPath);
  const productionReachable = getProductionReachable(
    productionDeps,
    allPackages,
  );

  // Build the bulk request payload: { packageName: [version] }
  const packageVersions = {};
  for (const [name, pkg] of Object.entries(allPackages)) {
    if (productionReachable.has(name)) {
      packageVersions[name] = [pkg.version];
    }
  }

  console.log(
    `Auditing ${Object.keys(packageVersions).length} production packages...`,
  );

  const advisories = await fetchAdvisories(packageVersions);
  const vulnerabilities = [];

  for (const [packageName, advisoryList] of Object.entries(advisories)) {
    const pkg = allPackages[packageName];
    if (!pkg) continue;

    for (const advisory of advisoryList) {
      if (EXCEPTION_SET.has(advisory.url)) continue;
      if (!SEVERITY_FILTER.has(advisory.severity)) continue;

      if (semver.satisfies(pkg.version, advisory.vulnerable_versions)) {
        vulnerabilities.push({
          packageName,
          installedVersion: pkg.version,
          severity: advisory.severity,
          title: advisory.title,
          url: advisory.url,
          vulnerableRange: advisory.vulnerable_versions,
        });
      }
    }
  }

  if (vulnerabilities.length === 0) {
    console.log(
      'No security advisories rated moderate or higher found for production dependencies.',
    );
    process.exit(0);
  }

  console.log(
    `\nFound ${vulnerabilities.length} security ${
      vulnerabilities.length === 1 ? 'advisory' : 'advisories'
    }:\n`,
  );

  for (const vuln of vulnerabilities) {
    const output = [
      `Security advisory:`,
      `  Title: ${vuln.title}`,
      `  Package: ${vuln.packageName}@${vuln.installedVersion}`,
      `  Severity: ${vuln.severity}`,
      `  Vulnerable range: ${vuln.vulnerableRange}`,
      `  Details: ${vuln.url}`,
    ].join('\n');

    if (process.env.CI) {
      console.log(`::warning::${output.replace(/\n/g, '%0A')}`);
    } else {
      console.log(`${output}\n`);
    }
  }
}

main().catch(err => {
  console.error(`Security audit failed: ${err.message}`);
  process.exit(2);
});
