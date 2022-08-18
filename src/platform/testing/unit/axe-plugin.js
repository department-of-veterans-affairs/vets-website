module.exports = function(chai, utils) {
  const axe = require('axe-core');
  const { Assertion } = chai;

  utils.addMethod(chai.Assertion.prototype, 'accessible', function(
    rules = {},
    rulesets = [
      'section508',
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'best-practice',
    ],
  ) {
    const el = this._obj;
    const config = {
      runOnly: {
        type: 'tag',
        values: rulesets,
      },
      rules: {
        region: { enabled: false },
        ...rules,
      },
    };
    return new Promise((resolve, reject) => {
      axe.run(el, config, (err, result) => {
        if (err) {
          reject(err);
        }

        const violations = result.violations?.map(violation => {
          const nodeInfo = violation.nodes.reduce((str, node) => {
            const { html, target } = node;
            return [str, html, ...target].join('\n');
          }, '');

          return `[${violation.impact}] ${violation.help}
See ${violation.helpUrl}
${nodeInfo}`;
        });

        try {
          new Assertion('axe').assert(
            !violations?.length,
            violations.join('\n\n'),
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });
};
