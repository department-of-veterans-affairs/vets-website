const Metalsmith = require('metalsmith');
const chalk = require('chalk');

const formatMemory = m => Math.round((m / 1024 / 1024) * 100) / 100;

/**
 * It's Metalsmith with some added shine.
 */
module.exports = () => {
  const smith = Metalsmith(__dirname);

  // Override the normal use function to provide timing and logging information
  smith._use = smith.use;
  let stepCount = 0;
  smith.use = function use(plugin, description) {
    const step = ++stepCount;
    if (!description) return smith._use(plugin);

    let timerStart;
    let heapUsedStart;

    /* eslint-disable no-console */
    return smith
      ._use(() => {
        heapUsedStart = process.memoryUsage().heapUsed;
        console.log(chalk.cyan(`\nStep ${step} start: ${description}`));
        timerStart = process.hrtime.bigint();
      })
      ._use(plugin)
      ._use(() => {
        const time = (process.hrtime.bigint() - timerStart) / 1000000n;

        // Color the time
        let color;
        if (time < 1000) color = chalk.green;
        else if (time < 10000) color = chalk.yellow;
        else color = chalk.red;
        const coloredTime = color(`[${time}ms]`);

        console.log(
          chalk.cyan(`Step ${step} end ${coloredTime}: ${description}`),
        );

        const heapUsedEnd = process.memoryUsage().heapUsed;
        console.log(
          chalk.bold('Starting memory:'),
          `${formatMemory(heapUsedStart)}mB`,
        );
        console.log(
          chalk.bold('Ending memory:'),
          `${formatMemory(heapUsedEnd)}mB`,
        );
        console.log(
          chalk.bold('Delta:'),
          `${formatMemory(heapUsedEnd - heapUsedStart)}mB`,
        );
      });
    /* eslint-enable no-console */
  };

  return smith;
};
