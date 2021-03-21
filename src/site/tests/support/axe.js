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

const axeCheck = container => {
  const options = {
    runOnly: {
      type: 'tag',
      values: ['section508', 'wcag2a', 'wcag2aa'],
    },
    rules: {
      // the 'bypass' check is disabled because it may give a false-positive
      // for lists of 4-5 links
      bypass: {
        enabled: false,
      },
      // the css file isn't referenced when the html document is created
      // so the 'color-contrast' check is disabled
      'color-contrast': {
        enabled: false,
      },
      // when testing liquid template include files, the title tag likely won't
      // be present in the html document so the 'document-title' check is disabled
      'document-title': {
        enabled: false,
      },
    },
  };

  return new Promise((resolve, reject) =>
    run(container, options, (error, { violations }) => {
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

export default axeCheck;
