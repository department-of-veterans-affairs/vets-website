/* eslint-disable no-console */

const ENVIRONMENTS = require('../../../../constants/environments');

const getHtmlFileList = require('./helpers/getHtmlFileList');
const performAudit = require('./helpers/performAudit');

function getAuditSummary(results) {
  let summary = `Scanned ${results.filesScanned} of ${
    results.totalFiles
  } files with ${results.failures.length} files failing and ${
    results.incompletes.length
  } incomplete scans`;

  if (results.failures.length > 0) {
    const failingPages = results.failures.map(result => result.url).join('\n');
    summary += `\nFailing pages: \n ${failingPages}`;
  }

  if (results.incompletes.length > 0) {
    const incompletePages = results.incompletes
      .map(result => result.url)
      .join('\n');
    summary += `\n Incomplete pages: ${incompletePages}`;
  }

  return summary;
}

function checkAccessibility(buildOptions) {
  const shouldExecute = buildOptions.accessibility;

  if (!shouldExecute) {
    const noop = () => {};
    return noop;
  }

  const environmentsThatMustPass = new Set([ENVIRONMENTS.VAGOVPROD]);

  const buildMustPass = environmentsThatMustPass.has(buildOptions.buildtype);

  return async (files, metalsmith, done) => {
    console.log('Starting accessibility tests...');
    console.time('Accessibility');

    const htmlFiles = getHtmlFileList(files);

    try {
      const results = await performAudit(buildOptions, htmlFiles);

      console.timeEnd('Accessibility');

      const summary = getAuditSummary(results);

      const hasFailures =
        results.failures.length > 0 || results.incompletes.length > 0;

      if (hasFailures && buildMustPass) {
        done(summary);
      } else {
        console.log(summary);
        done();
      }
    } catch (err) {
      if (buildMustPass) {
        done(err.message);
      } else {
        console.log(err);
        done();
      }
    }
  };
}

module.exports = checkAccessibility;
