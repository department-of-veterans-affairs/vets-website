const { spawn } = require('child_process');

const runCommand = cmd => {
  const child = spawn(cmd, [], { shell: true, stdio: 'inherit' });
  child.on('exit', code => {
    process.exit(code);
  });
};

module.exports = {
  runCommand,
};
