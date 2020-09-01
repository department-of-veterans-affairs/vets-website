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

const runCommandSync = (cmd, forcedExitCode = null) => {
  const child = spawnSync(cmd, [], { shell: true, stdio: 'inherit' });
  return child.status;
};

module.exports = {
  runCommand,
  runCommandSync,
};
