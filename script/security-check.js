/* eslint-disable no-console */

/**
 * Dependency security audit using npm audit (v2 bulk API).
 *
 * Replaces the vagov-platform dependency-check which relied on
 * `yarn audit --json` (v1 API). The v1 audit endpoint now returns
 * HTTP 500 for large dependency trees like vets-website.
 *
 * Filters:
 *  - Only production (non-dev) dependencies
 *  - Only advisories with severity in: low, moderate, high, critical
 *  - Excludes URLs listed in exceptionSet
 */

const { execSync } = require('child_process');

const exceptionSet = new Set([
  'https://npmjs.com/advisories/996',
  'https://npmjs.com/advisories/1488',
  'https://github.com/advisories/GHSA-r683-j2x4-v87g',
  'https://github.com/advisories/GHSA-8hfj-j24r-96c4',
]);
const severitySet = new Set(['high', 'critical', 'moderate', 'low']);

function runAudit() {
  let auditJson;
  try {
    // npm audit exits non-zero when vulnerabilities are found,
    // so we ignore the exit code and parse the JSON output.
    const output = execSync('npm audit --json --omit=dev', {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    auditJson = JSON.parse(output);
  } catch (err) {
    // npm audit exits with code 1 when vulnerabilities exist
    if (err.stdout) {
      try {
        auditJson = JSON.parse(err.stdout);
      } catch (parseErr) {
        console.error('Failed to parse npm audit output:', parseErr.message);
        process.exit(1);
      }
    } else {
      console.error('Failed to run npm audit:', err.message);
      process.exit(1);
    }
  }

  if (auditJson.error) {
    console.error(
      `npm audit failed: ${auditJson.error.summary || 'unknown error'}`,
    );
    process.exit(1);
  }

  const vulnerabilities = auditJson.vulnerabilities || {};
  const findings = [];

  for (const [pkgName, vuln] of Object.entries(vulnerabilities)) {
    if (severitySet.has(vuln.severity)) {
      // Each vuln has a 'via' array. Entries can be advisory objects or
      // strings (transitive references). We only report actual advisories.
      for (const via of vuln.via) {
        if (
          typeof via === 'object' &&
          !exceptionSet.has(via.url) &&
          severitySet.has(via.severity)
        ) {
          findings.push({
            title: via.title,
            moduleName: via.name,
            dependency: pkgName,
            severity: via.severity,
            url: via.url,
          });
        }
      }
    }
  }

  if (findings.length) {
    findings.forEach(f => {
      const output = `Security advisory: \n Title: ${f.title} \n Module name: ${
        f.moduleName
      } \n Dependency: ${f.dependency} \n Severity: ${f.severity} \n Details: ${
        f.url
      } \n`;

      if (process.env.CI) {
        const escaped = output
          .replace(/%/g, '%25')
          .replace(/\r/g, '%0D')
          .replace(/\n/g, '%0A');
        console.log(`::error::${escaped}`);
      } else {
        console.log(output);
      }
    });
    process.exit(1);
  } else {
    console.log('No security advisories found for non-dev dependencies.');
  }
}

runAudit();
