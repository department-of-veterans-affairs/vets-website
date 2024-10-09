const { spawn, spawnSync } = require('child_process');

const childProcesses = [];
process.on('SIGINT', () => {
  childProcesses.forEach(child => {
    child.kill('SIGINT');
  });
});

const runCommand = cmd => {
  const child = spawn(cmd, [], { shell: true, stdio: 'inherit' });

  // If the child process exits abnormally, exit parent with the same code
  child.on('exit', code => {
    if (code) {
      process.exit(code);
    }
  });

  // When we ^C out of the parent Node script, also interrupt the child
  childProcesses.push(child);
};

const runCommandSync = cmd => {
  const child = spawnSync(cmd, [], { shell: true, stdio: 'inherit' });
  return child.status;
};

/**
 * Returns a promise that resolves after specified time, for use with await()
 * @param {number} ms time to wait before resolving promise
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  runCommand,
  runCommandSync,
  sleep,
};
