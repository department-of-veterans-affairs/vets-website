const fs = require('fs');
const join = require('path').join;

/**
 * Grabs the all the data for a form.
 * @typedef {Object} Rules
 * @property {Stirng} extension - The file extension to look for
 * @property {Array<String>} ignore - Specific filenames to ignore
 * @property {Array<String>} only - Run tests on only these files
 * ---
 * @typedef {Object} DataSet
 * @property {String} fileName - The file name
 * @property {Object} contents - The parsed contents
 * ---
 * @param {String} path - The path it'll look in
 * @param {Object} rules - The rules it'll follow to find the files
 * @return {Array<DataSet>} - All the parsed files
 */
function getTestDataSets(path, rules = { extension: 'json' }) {
  return fs
    .readdirSync(path)
    .filter(fileName => fileName.endsWith(rules.extension))
    .filter(
      fileName =>
        Array.isArray(rules.only) ? rules.only.includes(fileName) : true,
    )
    .filter(
      fileName =>
        Array.isArray(rules.ignore) ? !rules.ignore.includes(fileName) : true,
    )
    .map(fileName => ({
      fileName,
      contents: JSON.parse(fs.readFileSync(join(path, fileName), 'utf8')),
    }));
}

/**
 * Searches for DOM elements found by selectors in page and removes
 * them from the DOM.
 * @param {Page} page - Puppeteer browser page
 * @param {...String} - The selectors used to find the elements to
 *                      remove
 */
async function searchAndDestroy(page, ...selectors) {
  await Promise.all(
    selectors.map(async sel =>
      page.$$eval(sel, elements =>
        elements.forEach(el => el.parentNode.removeChild(el)),
      ),
    ),
  );
}

module.exports = { getTestDataSets, searchAndDestroy };
