import axeCore from 'axe-core'; // eslint-disable-line no-unused-vars

const axeExceptions = {
  // axe rule id: violation check
  'color-contrast': violation => {
    const validNodes = violation.nodes.filter(node => {
      if (
        // number input has background image
        node.html.includes('type="number"') ||
        // some inputs have overlapping $ (cost inputs)
        node.html.startsWith('<input') ||
        // selects have a background image
        node.html.startsWith('<select') ||
        // radios labels overlap the input
        node.html.startsWith('<label') ||
        // added exception - specifically set white bg & dark fg colors
        // See src/applications/edu-benefits/0994/content/militaryService.jsx
        node.html.includes(
          'vads-u-background-color--white vads-u-color--gray-dark',
        ) ||
        // no idea why for these next 2
        node.html.startsWith('<legend') ||
        node.html.includes('schemaform-required-span')
      ) {
        return false;
      }
      return true;
    });
    return validNodes.length > 0;
  },
  'label-content-name-mismatch': violation => {
    const validNodes = violation.nodes.filter(node => {
      const href = node.getAttribute('href') || '';
      // ignore telephone links w/aria-label
      return !href.startsWith('tel:');
    });
    return validNodes.length > 0;
  },
};

const removeAxeExpections = violations => {
  const exceptions = Object.keys(axeExceptions);
  return violations.filter(violation => {
    let isValid = true;
    if (exceptions.includes(violation.id)) {
      isValid = axeExceptions[violation.id](violation);
    }
    return isValid;
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

      const filteredViolations = removeAxeExpections(violations);

      const scope = (config || {}).scope || '[n/a]';

      removeAxeExpections(violations).forEach(violation => {
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
