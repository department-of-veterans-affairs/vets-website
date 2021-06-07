/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const sassLintReport = path.join(__dirname, '../../stylelint-report.json');

if (!fs.existsSync(sassLintReport)) {
  console.log('No sass-lint report found. Skipping.');
  return;
}

const sassLintData = JSON.parse(fs.readFileSync(sassLintReport));

sassLintData.forEach(fileMessages => {
  if (!fileMessages.errored) return;

  for (const [key, value] of Object.entries(fileMessages)) {
    if (key !== 'source' && key !== 'errored' && value.length) {
      fileMessages[key].forEach(fileMessage => {
        const { severity, column, line, message } = fileMessage;
        const filePath = fileMessages.source;
        const severityTag = severity === 'error' ? '::error' : '::warning';
        const output = `${severityTag} file=${filePath},line=${line},col=${column}::${message}`;
        console.log(output);
      });
    }
  }
});
