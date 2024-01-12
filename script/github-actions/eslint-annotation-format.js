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
        } else if (msg.severity === 2) {
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

  let output;
  if (summary.errors.length > 0) {
    output = summary.errors
      .map(function(msg) {
        const filePath = msg.filePath
          .split('/')
          .splice(6)
          .join('/'); // removes GHA environment in the filepath to only have path from root
        return `::${
          msg.type
        } file=${filePath},line=${msg.line},col=${msg.column}::${filePath}:${msg.line}:${msg.column}:${msg.message}`;
      })
      .join('\n');
  } else {
    output = 'No errors detected!';
  }

  return `${output} \n`;
};
