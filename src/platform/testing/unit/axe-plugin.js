import axe from 'axe-core';

module.exports = function(chai, utils) {
  const Assertion = chai.Assertion;

  utils.addMethod(chai.Assertion.prototype, 'accessible', function(
    rules = {},
    rulesets = [],
  ) {
    const el = this._obj;
    const config = {
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'].concat(
          rulesets,
        ),
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
