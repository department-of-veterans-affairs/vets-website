module.exports = function(results) {
  const resultsArr = results || [];

  const summary = resultsArr.reduce(
    function(seq, current) {
      current.messages.forEach(function(msg) {
        const logMessage = {
          filePath: current.filePath,
          message: msg.message,
          line: msg.line,
          column: msg.column,
        };

        if (msg.severity === 1) {
          logMessage.type = 'warning';
          seq.warnings.push(logMessage);
        }
        if (msg.severity === 2) {
          logMessage.type = 'error';
          seq.errors.push(logMessage);
        }
      });
      return seq;
    },
    {
      errors: [],
      warnings: [],
    },
  );

  let lines;
  if (summary.errors.length > 0 || summary.warnings.length > 0) {
    lines = summary.errors
      .concat(summary.warnings)
      .map(function(msg) {
        return `\n ::${
          msg.type
        } file=${msg.filePath},line=${msg.line},col=${msg.column}::${msg.message}`;
      })
      .join('\n');
  }

  return `${lines} \n`;
};
