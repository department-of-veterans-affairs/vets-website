import { run } from 'axe-core';

const logViolations = violations => {
  violations.forEach(violation => {
    /* eslint-disable no-console */
    console.log('\nAxe Violation:\n', violation);
    /* eslint-enable no-console */

    violation.nodes.forEach((node, index) => {
      /* eslint-disable no-console */
      console.log(`\nNode ${index + 1}:\n`, node);
      /* eslint-enable no-console */
    });
  });
};

export default container => {
  return new Promise((resolve, reject) =>
    run(container, (error, response) => {
      if (error) {
        reject(error);
      } else {
        if (response.violations) {
          logViolations(response.violations);
        }

        resolve(response);
      }
    }),
  );
};
