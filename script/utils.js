const { spawn } = require('child_process');

const runCommand = (cmd, forcedExitCode = null) => {
  const child = spawn(cmd, [], { shell: true, stdio: 'inherit' });
  child.on('exit', code => {
    process.exit(forcedExitCode === null ? code : forcedExitCode);
  });
};

module.exports = {
  runCommand,
};
