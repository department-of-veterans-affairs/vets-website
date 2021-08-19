const { spawn, spawnSync } = require('child_process');

const runCommand = (cmd, forcedExitCode = null) => {
  const child = spawn(cmd, [], { shell: true, stdio: 'inherit' });
  child.on('exit', code => {
    process.exit(forcedExitCode === null ? code : forcedExitCode);
  });

  // When we ^C out of the parent Node script, also interrupt the child
  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });
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
