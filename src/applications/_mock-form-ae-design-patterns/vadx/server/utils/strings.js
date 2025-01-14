/**
 * Strip ANSI escape codes from a string
 * this makes the output more readable in the UI for terminal output
 * @param {string} str - The string to strip ANSI escape codes from
 * @returns {string} - The string with ANSI escape codes removed
 */
function stripAnsi(str) {
  return str.replace(/\[(\d+;)*\d+m/g, '');
}

module.exports = { stripAnsi };
