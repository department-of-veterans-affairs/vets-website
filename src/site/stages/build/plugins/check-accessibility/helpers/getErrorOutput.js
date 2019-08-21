function getErrorOutput(result) {
  const separator = '\n\n------------------\n\n';

  const formattedViolations = result.violations
    .map((violation, index) => {
      let output = `${index + 1}. [${violation.impact}] ${violation.help}\n`;

      output += `See ${violation.helpUrl}`;
      output += violation.nodes.reduce((str, node) => {
        const { html, target } = node;
        return [str, html, ...target].join('\n');
      }, '');

      return output;
    })
    .join('\n\n');

  const title = `${separator}${result.url} has ${
    result.violations.length
  } violation(s)!\n\n`;

  return title + formattedViolations + separator;
}

module.exports = getErrorOutput;
