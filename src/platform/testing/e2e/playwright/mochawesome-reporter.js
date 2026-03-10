/* eslint-disable no-console */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const uuid = () => crypto.randomUUID();

function getTestState(passed, failed) {
  if (passed) return 'passed';
  if (failed) return 'failed';
  return 'pending';
}

function buildTestEntry(test, result, parentUUID) {
  const passed = result.status === 'passed';
  const failed = result.status === 'failed' || result.status === 'timedOut';
  const skipped =
    result.status === 'skipped' || result.status === 'interrupted';

  const err =
    failed && result.error
      ? {
          message: result.error.message || '',
          estack: result.error.stack || '',
        }
      : {};

  return {
    title: test.title,
    fullTitle: test.titlePath().join(' > '),
    timedOut: result.status === 'timedOut',
    duration: result.duration,
    state: getTestState(passed, failed),
    speed: result.duration < 1000 ? 'fast' : 'slow',
    pass: passed,
    fail: failed,
    pending: skipped,
    context: null,
    code: '',
    err,
    uuid: uuid(),
    parentUUID,
    isHook: false,
    skipped: false,
  };
}

function buildSuite(suite, _parentUUID) {
  const suiteUUID = uuid();
  const tests = [];
  const passes = [];
  const failures = [];
  const pending = [];
  let duration = 0;

  for (const test of suite.tests) {
    const lastResult = test.results[test.results.length - 1];
    if (!lastResult) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const entry = buildTestEntry(test, lastResult, suiteUUID);
    tests.push(entry);
    duration += entry.duration;

    if (entry.pass) passes.push(entry.uuid);
    else if (entry.fail) failures.push(entry.uuid);
    else pending.push(entry.uuid);
  }

  const childSuites = suite.suites.map(s => buildSuite(s, suiteUUID));
  for (const child of childSuites) {
    duration += child.duration;
  }

  return {
    uuid: suiteUUID,
    title: suite.title,
    fullFile: '',
    file: '',
    beforeHooks: [],
    afterHooks: [],
    tests,
    suites: childSuites,
    passes,
    failures,
    pending,
    skipped: [],
    duration,
    root: false,
    rootEmpty: false,
    _timeout: 0,
  };
}

function collectAllTests(suite) {
  const tests = [];
  for (const test of suite.tests) {
    const lastResult = test.results[test.results.length - 1];
    if (lastResult) tests.push({ test, result: lastResult });
  }
  for (const child of suite.suites) {
    tests.push(...collectAllTests(child));
  }
  return tests;
}

class MochawesomeReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'cypress/results';
    this.outputFileName =
      options.outputFileName ||
      `playwright_${new Date().toISOString().replace(/[.:]/g, '')}`;
    this.rootSuite = null;
  }

  onBegin(config, suite) {
    this.rootSuite = suite;
  }

  onEnd(result) {
    if (!this.rootSuite) return;

    const allTests = collectAllTests(this.rootSuite);

    const stats = {
      suites: 0,
      tests: allTests.length,
      passes: 0,
      pending: 0,
      failures: 0,
      start: result.startTime?.toISOString() || new Date().toISOString(),
      end: new Date().toISOString(),
      duration: 0,
      testsRegistered: allTests.length,
      passPercent: 0,
      pendingPercent: 0,
      other: 0,
      hasOther: false,
      skipped: 0,
      hasSkipped: false,
    };

    // Group tests by file
    const fileMap = new Map();
    for (const { test, result: testResult } of allTests) {
      const filePath = test.location?.file || 'unknown';
      if (!fileMap.has(filePath)) fileMap.set(filePath, []);
      fileMap.get(filePath).push({ test, result: testResult });

      stats.duration += testResult.duration;
      if (testResult.status === 'passed') stats.passes += 1;
      else if (
        testResult.status === 'failed' ||
        testResult.status === 'timedOut'
      )
        stats.failures += 1;
      else stats.pending += 1;
    }

    stats.passPercent =
      stats.tests > 0
        ? Math.round((stats.passes / stats.tests) * 10000) / 100
        : 0;
    stats.pendingPercent =
      stats.tests > 0
        ? Math.round((stats.pending / stats.tests) * 10000) / 100
        : 0;

    // Build results array (one entry per file, matching mochawesome structure)
    const results = [];
    for (const projectSuite of this.rootSuite.suites) {
      for (const fileSuite of projectSuite.suites) {
        const rootUUID = uuid();

        // Build child suites (from describe blocks)
        const childSuites = fileSuite.suites.map(s => buildSuite(s, rootUUID));
        stats.suites += childSuites.length;

        // Build tests directly on the file suite (not in a describe)
        const directTests = [];
        const directPasses = [];
        const directFailures = [];
        const directPending = [];
        for (const t of fileSuite.tests) {
          const lastResult = t.results[t.results.length - 1];
          if (!lastResult) {
            // eslint-disable-next-line no-continue
            continue;
          }
          const entry = buildTestEntry(t, lastResult, rootUUID);
          directTests.push(entry);
          if (entry.pass) directPasses.push(entry.uuid);
          else if (entry.fail) directFailures.push(entry.uuid);
          else directPending.push(entry.uuid);
        }

        if (directTests.length > 0) stats.suites += 1;

        const filePath =
          fileSuite.tests[0]?.location?.file ||
          fileSuite.suites[0]?.tests[0]?.location?.file ||
          '';

        results.push({
          uuid: rootUUID,
          title: '',
          fullFile: filePath,
          file: filePath,
          beforeHooks: [],
          afterHooks: [],
          tests: directTests,
          suites: childSuites,
          passes: directPasses,
          failures: directFailures,
          pending: directPending,
          skipped: [],
          duration: 0,
          root: true,
          rootEmpty: directTests.length === 0,
          _timeout: 0,
        });
      }
    }

    const report = { stats, results };

    fs.mkdirSync(this.outputDir, { recursive: true });
    const outPath = path.join(this.outputDir, `${this.outputFileName}.json`);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(`Mochawesome report written to ${outPath}`);
  }
}

module.exports = MochawesomeReporter;
