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

  const body = brokenPages
    .map(brokenPage => {
      let pageChunk = `There are ${
        brokenPage.linkErrors.length
      } broken links on ${brokenPage.path}:\n\n`;
      pageChunk += brokenPage.linkErrors.map(link => link.html).join('\n');
      return pageChunk;
    })
    .join(separator);

  return header + body + separator;
}

module.exports = getErrorOutput;
