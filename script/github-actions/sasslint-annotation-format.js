// imports dynamically created file
const sasslintData = require('../../sasslint-report.json'); // eslint-disable-line import/no-unresolved

for (let i = 0; i < sasslintData.length; i++) {
  if (sasslintData[i].warningCount > 0 || sasslintData[i].errorCount > 0) {
    for (let j = 0; j < sasslintData[i].messages.length; j++) {
      let output = '';

      if (sasslintData[i].messages[j].severity === 0) {
        output += '::error ';
      } else {
        output += '::warning ';
      }

      output += `file=${sasslintData[i].filePath},line=${
        sasslintData[i].messages[j].line
      },col=${sasslintData[i].messages[j].column}::\n${
        sasslintData[i].filePath
      }:${sasslintData[i].messages[j].line}:${
        sasslintData[i].messages[j].column
      }:${sasslintData[i].messages[j].message}`;

      console.log(output); // eslint-disable-line no-console
    }
  }
}
