/* eslint-disable no-console */

const Metalsmith = require('metalsmith');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');

const {
  overloadConsoleWrites,
  isConsoleDirty,
  cleanConsole,
} = require('./console');

const formatMemory = m => Math.round((m / 1024 / 1024) * 100) / 100;

const logMemoryUsage = (heapUsedStart, heapUsedEnd) => {
  console.log(
    chalk.bold('Starting memory:'),
    `${formatMemory(heapUsedStart)}mB`,
  );
  console.log(chalk.bold('Ending memory:'), `${formatMemory(heapUsedEnd)}mB`);
  console.log(
    chalk.bold('Delta:'),
    `${formatMemory(heapUsedEnd - heapUsedStart)}mB`,
  );
};

/**
 * It's Metalsmith with some added shine.
 */
module.exports = () => {
  const smith = Metalsmith(__dirname);
  overloadConsoleWrites();

  smith.stepStats = [];
  let stepCount = 0;
  let lastLogLineLength = 0;

  const logStepStart = (step, description) => {
    const logLine = `\nStep ${step + 1} of ${stepCount} start: ${description}`;
    console.log(chalk.cyan(logLine));
    lastLogLineLength = logLine.length % process.stdout.columns;
    cleanConsole();
  };

  const logStepEnd = (step, description, timeElapsed) => {
    // Color the time
    let color;
    if (timeElapsed < 1000) color = chalk.green;
    else if (timeElapsed < 10000) color = chalk.yellow;
    else color = chalk.red;
    const coloredTime = color(`[${timeElapsed}ms]`);

    if (process.stdout.isTTY && !global.verbose && !isConsoleDirty()) {
      // Just append the logStepStart line with the time elapsed
      process.stdout.cursorTo(lastLogLineLength, process.stdout.rows - 2);
      process.stdout.write(`${coloredTime}`);
      // If we added another cursorTo(0, process.stdout.rows), it creates
      // a blank line between the two logStepStart lines
      if (step + 1 === stepCount) {
        // Last step; clean it up with a newline
        process.stdout.write('\n');
      }
    } else {
      // Output to a new line
      console.log(
        chalk.cyan(`Step ${step + 1} end ${coloredTime}: ${description}`),
      );
    }
  };

  // Override the normal use function to log additional information
  smith._use = smith.use;
  smith.use = function use(plugin, description = 'Unknown Plugin') {
    const step = stepCount++;
    smith.stepStats[step] = { description };

    let timerStart;
    let heapUsedStart;

    return smith
      ._use(() => {
        heapUsedStart = process.memoryUsage().heapUsed;
        smith.stepStats[step].memoryStart = heapUsedStart;
        logStepStart(step, description);
        timerStart = process.hrtime.bigint();
      })
      ._use(plugin)
      ._use(() => {
        const heapUsedEnd = process.memoryUsage().heapUsed;
        smith.stepStats[step].memoryEnd = heapUsedEnd;

        const timeElapsed = (process.hrtime.bigint() - timerStart) / 1000000n;
        smith.stepStats[step].timeElapsed = timeElapsed;

        logStepEnd(step, description, timeElapsed);
        if (global.verbose) {
          logMemoryUsage(heapUsedStart, heapUsedEnd);
        }
      });
  };

  smith.printSummary = function printSummary() {
    const table = new AsciiTable('Step summary');
    table.setHeading(
      'Step',
      'Description',
      'Time Elapsed',
      'Memory Used This Step',
      'Total Memory Used After Step',
    );
    smith.stepStats.forEach((stats, index) =>
      table.addRow(
        index,
        stats.description,
        `${stats.timeElapsed}ms`,
        `${formatMemory(stats.memoryEnd - stats.memoryStart)}mB`,
        `${formatMemory(stats.memoryEnd)}mB`,
      ),
    );

    table.removeBorder();
    console.log(table.toString());
  };

  return smith;
};
