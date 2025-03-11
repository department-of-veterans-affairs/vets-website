/**
 * Strip ANSI escape codes from a string
 * this makes the output more readable in the UI for terminal output
 * @param {string} str - The string to strip ANSI escape codes from
 * @returns {string} - The string with ANSI escape codes removed
 */
function stripAnsi(str) {
  // couldn't figure out a good way to strip ansi codes
  // from the output without using a regex that contained control characters
  // this eslint rule also is created to avoid mistakes as these control characters are 'rarely used'
  // but in our case we need to strip them
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
}

module.exports = { stripAnsi };
