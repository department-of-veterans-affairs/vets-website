// TODO(awong): Convert to ES6

// Returns an object suitable for a nightwatch test case.
//
// Provides test framework maintainers a single entry point for annotating all tests with things
// like uniform reporters.
//
// @param {beginApplication} Callable taking one argument, client, that runs the e2e test.
function createE2eTest(beginApplication) {
  return { 'Begin application': beginApplication };
}

module.exports = {
  baseUrl: 'http://localhost:8080',
  createE2eTest,
};
