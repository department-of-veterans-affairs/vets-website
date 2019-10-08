/**
 * Formats the final list of broken pages into useful console output.
 * @param {Array} brokenPages Outcome of validating
 */
function getErrorOutput(brokenPages) {
  const brokenLinkCount = brokenPages.reduce(
    (sum, page) => sum + page.linkErrors.length,
    0,
  );
  const separator = '\n\n---\n\n';
  const header = `${separator}There are ${brokenLinkCount} broken links!${separator}`;

  const csvHeader = 'Page,Broken link\n';
  const csvBody = brokenPages
    .map(brokenPage =>
      brokenPage.linkErrors
        .map(link => `${brokenPage.path},${link.html.replace(/\n/g, '')}`)
        .join('\n'),
    )
    .join('\n');

  return header + csvHeader + csvBody + separator;
}

module.exports = getErrorOutput;
