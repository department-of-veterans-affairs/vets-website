/* eslint-disable no-console */
/*
 * This script parses the yarn audit JSON results to find security advisories
 * that affect modules in our dependencies list that are moderate or higher
 * and aren't in our exceptions list
 */
const { spawn } = require('child_process');

const packageJSON = require('../package.json');

const exceptionSet = new Set([
  'https://npmjs.com/advisories/996',
  'https://npmjs.com/advisories/1488',
  'https://github.com/advisories/GHSA-r683-j2x4-v87g',
  'https://github.com/advisories/GHSA-8hfj-j24r-96c4',
]);

const severitySet = new Set(['high', 'critical', 'moderate']);

const dependencySet = new Set(Object.keys(packageJSON.dependencies));

function getAffectedModule(data) {
  return data.resolution.path.split('>')[0];
}

function processAuditResults(audit) {
  // The output isn't valid JSON, it's a list of JSON
  // objects separated by newlines
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
      const output = `Security advisory: \n Title: ${
        adv.data.advisory.title
      } \n Module name: ${
        adv.data.advisory.module_name
      } \n Dependency: ${getAffectedModule(adv.data)} \n Path: ${
        adv.data.resolution.path
      } \n Severity: ${adv.data.advisory.severity} \n Details: ${
        adv.data.advisory.url
      } \n`;

      if (process.env.CI) {
        console.log(`::error::${output.replace(/\n/g, '%0A')}`);
      } else {
        console.log(output);
      }
    });
  } else {
    console.log(
      'No security advisories rated moderate or higher found for non-dev dependencies.',
    );
  }

  process.exit(validAdvisories.length);
}

function runAudit() {
  const child = spawn('yarn', ['audit', '--json']);
  let auditOutput = '';

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', data => {
    auditOutput += data;
  });

  child.stderr.on('data', data => {
    console.error(data);
  });

  child.on('close', () => {
    processAuditResults(auditOutput);
  });
}

runAudit();
