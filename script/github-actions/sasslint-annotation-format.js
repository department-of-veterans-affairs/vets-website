const fs = require('fs');
const path = require('path');

const sassLintData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../sasslint-report.json')),
);

sassLintData.forEach(fileMessages => {
  if (!fileMessages.warningCount && !fileMessages.errorCount) return;

  fileMessages.messages.forEach(fileMessage => {
    const { severity, column, line, message } = fileMessage;
    const filePath = fileMessages.filePath;
    const severityTag = severity === 0 ? '::error' : '::warning';
    const output = `${severityTag} file=${filePath},line=${line},col=${column}::${filePath}:${line}:${column}:${message}`;
    console.log(output); // eslint-disable-line no-console
  });
});
