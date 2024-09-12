const { spawn, spawnSync } = require('child_process');

const childProcesses = [];
process.on('SIGINT', () => {
  childProcesses.forEach(child => {
    child.kill('SIGINT');
  });
});

const runCommand = cmd => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [], { shell: true, stdio: 'inherit' });

    // When the child process exits, resolve or reject the promise
    child.on('exit', code => {
      if (code === 0) {
        resolve(); // Successfully completed
      } else {
        reject(new Error(`Process exited with code ${code}`)); // Error occurred
      }
    });

    // When we ^C out of the parent Node script, also interrupt the child
    childProcesses.push(child);

    // Handle process errors like spawning failure
    child.on('error', err => {
      reject(err);
    });
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
