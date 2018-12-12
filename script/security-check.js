/* eslint-disable no-console */
/*
 * This script parses the yarn audit JSON results to find security advisories
 * that affect modules in our dependencies list that are moderate or higher
 * and aren't in our exceptions list
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const packageJSON = require('../package.json');

const exceptions = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../.nsprc'), 'utf8'),
).exceptions;

const dependencySet = new Set(Object.keys(packageJSON.dependencies));
const exceptionSet = new Set(exceptions);
const severitySet = new Set(['high', 'critical', 'moderate']);

function getAffectedModule(data) {
  return data.resolution.path.split('>')[0];
}

function processAuditResults(audit) {
  const advisories = audit
    .trim()
    .split('\n')
    .map(a => JSON.parse(a));

  const validAdvisories = advisories.filter(adv => {
    if (adv.type === 'auditAdvisory') {
      const advisoryData = adv.data.advisory;
      const affectedModule = getAffectedModule(adv.data);
      return (
        !exceptionSet.has(advisoryData.url) &&
        severitySet.has(advisoryData.severity) &&
        dependencySet.has(affectedModule)
      );
    }

    return false;
  });

  if (validAdvisories.length) {
    validAdvisories.forEach(adv => {
      console.log(`
Security advisory:
  Title: ${adv.data.advisory.title}
  Module name: ${adv.data.advisory.module_name}
  Dependency: ${getAffectedModule(adv.data)}
  Severity: ${adv.data.advisory.severity}
  Details: ${adv.data.advisory.url}
      `);
    });
  } else {
    console.log(
      'No security advisories rated moderate or higher found for non-dev dependencies.',
    );
  }

  process.exit(validAdvisories.length);
}

const child = spawn('yarn', ['audit', '--json']);
let auditOutput = '';

child.stdout.setEncoding('utf8');

child.stdout.on('data', data => {
  auditOutput += data;
});

child.stderr.on('data', data => {
  console.error(data);
});

child.on('close', () => {
  processAuditResults(auditOutput);
});
