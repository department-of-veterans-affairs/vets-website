/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const main = () => {
  const styleLintReport = path.join(__dirname, '../../stylelint-report.json');

  if (!fs.existsSync(styleLintReport)) {
    console.log('No stylelint report found. Skipping.');
    return;
  }

  const styleLintData = JSON.parse(fs.readFileSync(styleLintReport));

  styleLintData.forEach(fileMessages => {
    if (!fileMessages.errored) return;

    for (const [key, value] of Object.entries(fileMessages)) {
      if (key !== 'source' && key !== 'errored' && value.length) {
        fileMessages[key].forEach(fileMessage => {
          const { severity, column, line, text } = fileMessage;
          const filePath = fileMessages.source;
          const severityTag = severity === 'error' ? '::error' : '::warning';
          const output = `${severityTag} file=${filePath},line=${line},col=${column}::${text}`;
          console.log(output);
        });
      }
    }
  });
};

main();
