/* eslint-disable no-console */

const Metalsmith = require('metalsmith');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');

const formatMemory = m => Math.round((m / 1024 / 1024) * 100) / 100;

const logStepStart = (step, description) =>
  console.log(chalk.cyan(`\nStep ${step + 1} start: ${description}`));

const logStepEnd = (step, description, timeElapsed) => {
  // Color the time
  let color;
  if (timeElapsed < 1000) color = chalk.green;
  else if (timeElapsed < 10000) color = chalk.yellow;
  else color = chalk.red;
  const coloredTime = color(`[${timeElapsed}ms]`);

  console.log(
    chalk.cyan(`Step ${step + 1} end ${coloredTime}: ${description}`),
  );
};

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

  smith.stepStats = [];

  // Override the normal use function to log additional information
  smith._use = smith.use;
  let stepCount = 0;
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
        logMemoryUsage(heapUsedStart, heapUsedEnd);
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
