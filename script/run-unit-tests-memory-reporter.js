/* eslint-disable no-console */
const { reporters, Runner } = require('mocha');
const fs = require('fs');
const path = require('path');

const { Base, Spec } = reporters;

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_END,
  EVENT_SUITE_BEGIN,
  EVENT_TEST_BEGIN,
} = Runner.constants;

// gcFrequency can be 'test', 'suite', or 'never' to not run gc at all
// if an empty string is passed, it will gc before and after the suite
const GC_FREQUENCY = {
  test: 'test',
  suite: 'suite',
  never: 'never',
};

// will indicate to run gc on 1/n tests, but only if
// gc is available in node environment and gcFrequency is 'test'
const GC_SAMPLE_RATE = 1;

// because its fun
function getEmojiForRank(rank) {
  const emojis = ['🥇 ', '🥈 ', '🥉 ', '🏅 ', '🏅 '];
  return emojis[rank - 1] || '';
}

class MemoryReporter extends Base {
  constructor(runner, options) {
    super(runner, options);

    const specReporter = new Spec(runner, options);
    specReporter.description = 'Memory Reporter';
    console.log('Reporter initialized for:', specReporter.description);

    this.config = {
      gcFrequency: options?.reporterOptions?.gcFrequency || '',
      sampleRate: options?.reporterOptions?.sampleRate || GC_SAMPLE_RATE,
    };

    this.memoryStats = {
      suites: new Map(),
      testResults: new Map(),
      baseline: process.memoryUsage(),
      testCount: 0,
    };

    // check if we have access to garbage collection in global scope
    this.forceGC = typeof global.gc === 'function';
    if (!this.forceGC) {
      console.log(
        'Garbage collection not available - gcFrequency and sampleRate will be ignored',
      );
    }

    // bind all the runner events
    // this allows us to hook into the mocha events
    // and run our own logic during the test run
    this.bindEvents(runner);
  }

  bindEvents(runner) {
    runner.on(EVENT_RUN_BEGIN, () => this.onStart());
    runner.on(EVENT_SUITE_BEGIN, suite => this.onSuite(suite));
    runner.on(EVENT_TEST_BEGIN, test => this.onTest(test));
    runner.on(EVENT_TEST_END, test => this.onTestEnd(test));
    runner.on(EVENT_RUN_END, () => this.onEnd());
  }

  takeSnapshot(
    force = false,
    disabled = this.config.gcFrequency === GC_FREQUENCY.never,
  ) {
    if (!disabled && this.forceGC && force) {
      global.gc();
    }

    return process.memoryUsage();
  }

  static formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    // for B, show whole number
    if (unitIndex === 0) {
      return `${Math.round(size)} ${units[unitIndex]}`;
    }

    // for KB, MB, GB show 3 decimal places
    return `${size.toFixed(3)} ${units[unitIndex]}`;
  }

  /**
   * determine if garbage collection should run based on the event type and config
   * @param {string} eventType - 'test', 'suite', 'end'
   * @returns {boolean}
   */
  shouldRunGC(eventType = '') {
    const gcRules = {
      test: () => this.memoryStats.testCount % this.config.sampleRate === 0,
      suite: () => true,
      end: () => false,
    };

    const matchingRule = gcRules[eventType] && gcRules[this.config.gcFrequency];

    return matchingRule?.() ?? false;
  }

  onStart() {
    // run gc before any tests are run, just to make sure we have a baseline and
    // any memory leaks are caught from the start
    this.startSnapshot = this.takeSnapshot(true);
  }

  onSuite(suite) {
    if (suite.root) return;

    // only run gc if gcFrequency is 'suite'
    const snapshot = this.takeSnapshot(this.shouldRunGC(GC_FREQUENCY.suite));

    this.memoryStats.suites.set(suite.title, {
      title: suite.title,
      file: suite.file,
      memoryBefore: snapshot,
    });
  }

  onTest(test) {
    // only run gc if gcFrequency is 'test' and testCount is divisible by sampleRate
    const snapshot = this.takeSnapshot(this.shouldRunGC(GC_FREQUENCY.test));

    this.memoryStats.testResults.set(test.title, {
      title: test.title,
      file: test.parent?.file,
      memoryBefore: snapshot,
    });
  }

  onTestEnd(test) {
    // don't run gc on test end. we already ran gc on test start (potentially)
    const snapshot = this.takeSnapshot();

    const testStats = this.memoryStats.testResults.get(test.title);

    if (!testStats) {
      console.log(
        'Test stats not found for:',
        test.title,
        'stats may not be accurate',
      );
      return;
    }

    const memoryDiff = Math.max(
      0,
      snapshot.heapUsed - testStats.memoryBefore.heapUsed,
    );

    this.memoryStats.testResults.set(test.title, {
      ...testStats,
      memoryAfter: snapshot,
      memoryDiff,
      duration: test?.duration || 0,
    });

    this.memoryStats.testCount += 1;
  }

  generateReport() {
    const testResults = Array.from(this.memoryStats.testResults.entries()).map(
      ([title, data]) => ({ title, ...data }),
    );

    const totalRuntime = testResults.reduce(
      (sum, test) => sum + test.duration,
      0,
    );

    const avgMemoryPerTest =
      testResults.reduce((sum, test) => sum + test.memoryDiff, 0) /
      testResults.length;

    // always run gc on end to get a final snapshot
    const endSnapshot = this.takeSnapshot(true);

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalTestingDuration: `${totalRuntime}ms, ${(
          totalRuntime / 1000
        ).toFixed(2)}s`,
        totalTests: this.stats.tests,
        startMemoryUsage: MemoryReporter.formatBytes(
          this.startSnapshot.heapUsed,
        ),
        endMemoryUsage: MemoryReporter.formatBytes(endSnapshot.heapUsed),
        averageMemoryPerTest: MemoryReporter.formatBytes(avgMemoryPerTest),
        gcAvailable: this.forceGC,
        gcFrequency: this.config.gcFrequency,
        sampleRate: this.config.sampleRate,
      },
      tests: testResults.map(test => ({
        title: test.title,
        file: test.file ? path.relative(process.cwd(), test.file) : 'unknown',
        memoryUsed: MemoryReporter.formatBytes(test.memoryDiff),
        duration: `${test.duration}ms - ${(test.duration / 1000).toFixed(3)}s`,
        memoryDiff: test.memoryDiff,
      })),
    };
  }

  static sortTestsByMemoryUsed(tests) {
    return tests.sort((a, b) => (b.memoryDiff || 0) - (a.memoryDiff || 0));
  }

  onEnd() {
    const report = this.generateReport();
    const sortedTests = MemoryReporter.sortTestsByMemoryUsed(report.tests);

    // Display report summary
    console.log('\n📊 Memory Usage Report');
    console.log('====================');
    console.log(JSON.stringify(report.summary, null, 2));

    if (sortedTests.length > 1) {
      console.log('\n🏆 Usage Leaderboard (Top 5)');
      console.log('=========================');
      sortedTests.slice(0, 5).forEach((test, i) => {
        const emoji = getEmojiForRank(i + 1);
        console.log(`\n${emoji} ${test.memoryUsed} - ${test.title}`);
        console.log(`    File: ${test.file}`);
        console.log(`    Duration: ${test.duration}`);
      });
    }

    if (sortedTests.length === 1) {
      console.log('\n🚨 Only one test was run');
      console.log(JSON.stringify(report, null, 2));
    }

    // write report to file
    // TODO: make this configurable
    // TODO: make this optional
    // TODO: make this a reporter option
    // current report path is hardcoded to build/localhost/_reports
    try {
      const reportDir = path.join(process.cwd(), './build/localhost/_reports');
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      const reportPath = path.join(reportDir, 'memory-test-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\nFull report written to: ${reportPath}`);
    } catch (error) {
      console.error('Error writing report:', error);
    }

    // Call epilogue from base reporter
    // so that the test results are displayed and the process exits
    this.epilogue();
  }
}

module.exports = MemoryReporter;
