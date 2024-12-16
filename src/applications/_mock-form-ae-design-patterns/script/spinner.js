/* eslint-disable no-console */
const createSpinner = message => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;

  process.stdout.write('\x1B[?25l'); // Hide cursor
  const spinner = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}`);
    i = (i + 1) % frames.length;
  }, 80);

  return {
    stop: endMessage => {
      clearInterval(spinner);
      process.stdout.write('\r\x1B[K'); // Clear line
      process.stdout.write('\x1B[?25h'); // Show cursor
      if (endMessage) console.log(endMessage);
    },
  };
};

module.exports = createSpinner;
