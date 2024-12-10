const { exec } = require('child_process');

function killProcessOnPort(portToKill) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';

    let command;
    if (isWin) {
      command = `FOR /F "tokens=5" %a in ('netstat -aon ^| find ":${portToKill}" ^| find "LISTENING"') do taskkill /F /PID %a`;
    } else {
      command = `lsof -ti :${portToKill} | xargs kill -9`;
    }

    exec(command, error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(`Error killing process on port ${portToKill}: ${error}`);
        reject(error);
      } else {
        // eslint-disable-next-line no-console
        console.log(`Process on port ${portToKill} killed`);
        resolve();
      }
    });
  });
}

function stripAnsi(str) {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
}

module.exports = { killProcessOnPort, stripAnsi };
