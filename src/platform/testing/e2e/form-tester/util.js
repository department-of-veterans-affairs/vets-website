const fs = require('fs');
const join = require('path').join;
const { AxePuppeteer } = require('axe-puppeteer');

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
 * Axe Puppeteer testing. Get full details here:
 * https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#result-arrays
 * @typedef {Object} Axe rules
 * @property {String} id - Axe rule id
 * @property {String} impact - 'moderate', 'serious', null, etc
 * @property {Array<String>} tags - Rule tags, e.g. 'best-practoce', 'wcag2a', etc
 * @property {String} description - Rule description; starts with "Ensures"
 * @property {String} help - Short rule description
 * @property {String} helpUrl - Url to deque university rule
 * @property {Array<NodeData>} nodes - Array of elements tested
 * ---
 * @typedef {Object} NodeData - We're only interested in the `target` value in
 *  this situation; see the full list at the axe url above
 * @property {Array<String>} target - css selectors pointing to the elements
 */
const axe = {
  // axe core config
  CONFIG: {
    checks: ['section508', 'wcag2a', 'wcag2aa'],
  },

  // ignore best practice violations, for now
  IGNORE: 'best-practice',

  // stores array of violations per page
  violations: new Map(),

  // stores AxePuppeteer instance
  pages: new Map(),

  /**
   * Checks the page for axe violations
   * @param {object} - Puppeteer page object
   * @param {log} - test log
   */
  check: async (page, log) => {
    const url = page.url();
    const previousCheck = axe.violations.get(url) || [];
    const axeChecker =
      axe.pages.get(url) || new AxePuppeteer(page).configure(axe.CONFIG);

    const results = await axeChecker.analyze();
    const violations = results.violations?.filter(
      v => !v.tags.includes(axe.IGNORE),
    );

    if (violations?.length) {
      axe.violations.set(url, [...violations, ...previousCheck]);
      violations.forEach(violation =>
        log(`>>>> axe error: ${violation.help} <<<<`),
      );
    }
    axe.pages.set(url, axeChecker);
  },

  expandAndCheck: async (page, log) => {
    const hasAccord = await axe.expand(page, log, '.accordion-header button');
    const hasInfo = await axe.expand(page, log, '.additional-info-button');
    if (hasAccord || hasInfo) {
      await axe.check(page, log);
    }
  },

  expand: (page, log, selector) =>
    page.$$eval(selector, els => {
      els.forEach(button => {
        if (button.getAttribute('aria-expanded') === 'false') {
          button.click();
        }
      });
    }),

  getViolations: () => axe.violations,

  clear: () => {
    axe.violations.clear();
    axe.pages.clear();
  },

  formatViolations: () => {
    const message = [];
    axe.violations.forEach((violations, key) => {
      let violation = `\n  page: ${key}`;
      violations.forEach(({ id, impact, tags, help, nodes }) => {
        const tagList = tags?.join(', ') || '';
        const nodeList = nodes.map(node => node.target).join(', ');
        violation += `\n  id: ${id}\n  impact: ${impact}\n  tags: ${tagList}`;
        violation += `\n  help: ${help}\n  nodes: ${nodeList}\n`;
      });
      message.push(violation);
    });
    axe.clear();
    return message.join('  ==========');
  },
};

module.exports = { axe, getTestDataSets };
