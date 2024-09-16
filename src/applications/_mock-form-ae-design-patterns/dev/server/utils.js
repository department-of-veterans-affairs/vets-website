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

module.exports = { killProcessOnPort };
