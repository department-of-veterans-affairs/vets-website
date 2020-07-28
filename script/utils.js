const { spawn } = require('child_process');

const runCommand = cmd => {
  const command = spawn(cmd, [], { shell: true, stdio: 'inherit' });
  command.on('exit', code => {
    process.exit(code);
  });
};

module.exports = {
  runCommand,
};
