const Metalsmith = require('metalsmith');
const chalk = require('chalk');

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

    /* eslint-disable no-console */
    return smith
      ._use(() => {
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
      });
    /* eslint-enable no-console */
  };
};
