import { run } from 'axe-core';

const logViolations = violations => {
  /* eslint-disable no-console */
  console.log(
    `\n${violations.length} Accessibility Violation${
      violations.length === 1 ? ' Was' : 's Were'
    } Detected`,
  );

  violations.forEach((violation, violationIdx) => {
    console.log(`\nAxe Violation ${violationIdx + 1}:\n`, violation);

    violation.nodes.forEach((node, nodeIdx) => {
      console.log(`\nNode ${nodeIdx + 1}:\n`, node);
    });
  });

  /* eslint-enable no-console */
};

export default (container, options = {}) => {
  const { _13647Exception } = options;

  /**
   * Default required ruleset to meet Section 508 compliance.
   * Do not remove values[] entries. Only add new rulesets like 'best-practices'.
   *
   * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
   * for available rulesets.
   */
  let axeBuilder = {
    runOnly: {
      type: 'tag',
      values: ['section508', 'wcag2a', 'wcag2aa'],
    },
    rules: {
      'color-contrast': {
        enabled: false,
      },
    },
  };

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   */
  axeBuilder = Object.assign(axeBuilder, options);

  const axeConfig = _13647Exception
    ? { includedImpacts: ['critical'] }
    : axeBuilder;

  return new Promise((resolve, reject) =>
    run(container, axeConfig, (error, { violations }) => {
      if (error) {
        reject(error);
      } else {
        if (violations.length) {
          logViolations(violations);
        }

        resolve(violations);
      }
    }),
  );
};
