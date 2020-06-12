import axeCore from 'axe-core'; // eslint-disable-line no-unused-vars

// Axe v3.5.4 does not accurately determine the foreground color on the
// following elements. This causes a lot of color-contrast errors
const contrastExceptions = [
  // number input has a background image (up-down arrow)
  'type="number"',
  // some inputs have overlapping content (`$` content overlaps cost inputs)
  '<input',
  // selects have a background image (up-down arrow)
  '<select',
  // radios labels overlap the input
  '<label',
  // added exception - specifically set white bg & dark fg colors
  // See src/applications/edu-benefits/0994/content/militaryService.jsx
  'vads-u-background-color--white vads-u-color--gray-dark',

  // no idea why the following exceptions are necessary:
  '<legend',
  '<textarea',
  'radioText', // span
  'schemaform-required-span', // span
  'usa-alert-body', // span
  'usa-button-secondary', // button
  // applications/vaos/tests/e2e/va-single-system.e2e.spec
  // 79 characters remaining
  'vads-u-font-style--italic',
];

const axeExceptions = {
  // axe rule id: violation check
  'color-contrast': violation =>
    violation.nodes.filter(node => {
      // combine innerHTML + target selector array
      const data = `${node.html} ${node.target.join(',')}`;
      // return false;
      return !contrastExceptions.some(exception => data.includes(exception));
    }),
  'label-content-name-mismatch': violation =>
    violation.nodes.filter(node => {
      const href = node.getAttribute('href') || '';
      // ignore telephone links w/aria-label
      return !href.startsWith('tel:');
    }),
};

const removeAxeExpections = violations => {
  const exceptions = Object.keys(axeExceptions);
  return violations.map(violation => {
    let nodes = [];
    if (exceptions.includes(violation.id)) {
      nodes = axeExceptions[violation.id](violation);
      // console.log(violation.id, ' => ', isValid);
    }
    return nodes.length > 0 ? { ...violation, nodes } : null;
  });
};

/**
 * Runs aXe checker on the given context
 * @param  {string} context The selector to run the axe check against
 * @param  {object} config Additional axe configuration options
 * @api commands
 */
export function command(context, config, _callback) {
  // Find the source of the axe module

  // TODO: since this is executed in the context of the browser,
  // we probably don't need to include this as an npm dependency,
  // we may be able to just download it locally into a test fixtures
  // directory and load the source.
  const axeSource = module.children.find(
    el => el.filename.indexOf('axe-core') !== -1,
  ).exports.source;

  // Attach the axe source to the document
  this.execute(
    innerAxeSource => {
      const script = document.createElement('script');
      script.text = innerAxeSource;
      document.head.appendChild(script);
    },
    [axeSource],
  );

  // Run axe checks and report
  this.executeAsync(
    (innerContext, rules, done) => {
      // eslint-disable-next-line no-undef
      axe.run(
        document.querySelector(innerContext) || document,
        {
          runOnly: {
            type: 'tag',
            values: rules,
          },
        },
        (err, results) => {
          done({ err, results });
        },
      );
    },
    [
      context,
      (config || {}).rules ||
        this.globals.rules || ['section508', 'wcag2a', 'wcag2aa'],
    ],
    response => {
      const { err, results } = response.value;

      if (err) {
        this.verify.fail(err);
        return;
      }

      if (!results) {
        this.verify.fail('No scan results found');
        return;
      }

      const { violations } = results;

      const filteredViolations = removeAxeExpections(violations).filter(
        v => v.nodes.length,
      );

      // if (filteredViolations.length) console.log('======> ', JSON.stringify(filteredViolations))

      const scope = (config || {}).scope || '[n/a]';

      filteredViolations.forEach(violation => {
        const nodeInfo = violation.nodes.reduce((str, node) => {
          const { html, target } = node;
          return [str, html, ...target].join('\n');
        }, '');
        const message = `${scope}: [${violation.impact}] ${violation.help}
See ${violation.helpUrl}
${nodeInfo}`;
        this.verify.fail(message);
      });
    },
  );
}
