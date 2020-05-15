const { spawn } = require('child_process');

const runCommand = cmd => {
  const child = spawn(cmd, [], { shell: true });
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
};

module.exports = {
  runCommand,
};
