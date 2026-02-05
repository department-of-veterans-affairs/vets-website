/* eslint-disable no-console */
const commandLineUsage = require('command-line-usage');

const helpSections = [
  {
    header: 'Unit test run script',
    content:
      'Unified test runner for vets-website. Works in both local development and GitHub Actions environments.',
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. Run all the unit tests ',
        example: '$ yarn test:unit',
      },
      {
        desc: '2. Run tests for a specific app folder ',
        example: '$ yarn test:unit --app-folder vaos',
      },
      {
        desc: '3. Run tests with extra error logging for a specific file',
        example:
          '$ yarn test:unit --log-level debug src/applications/vaos/tests/components/ExpressCareListItem.jsx',
      },
      {
        desc: '4. Run tests with code coverage metrics as HTML',
        example:
          '$ yarn test:unit --app-folder personalization --coverage --coverage-html',
      },
      {
        desc: '5. Run only tests for changed files (like CI)',
        example: '$ yarn test:unit --changed-only',
      },
      {
        desc: '6. Run full test suite explicitly',
        example: '$ yarn test:unit --full-suite',
      },
    ],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'log-level',
        typeLabel: '{underline log}, {underline debug}, {underline trace}',
        description:
          'Set the log level for the unit test output. {underline debug} provides errors with stack traces scrubbed of node_modules lines.' +
          ' {underline trace} outputs all errors and warnings. Defaults to {underline log}, which hides errors outside of specific test failures',
      },
      {
        name: 'coverage',
        typeLabel: '{underline boolean}',
        description:
          'Runs the unit tests with code coverage metrics, and outputs the results to a JSON report in coverage/',
      },
      {
        name: 'coverage-html',
        typeLabel: '{underline boolean}',
        description:
          'Used in conjunction with `--coverage`. Runs the unit tests with code coverage metrics, and outputs the results to an HTML report in coverage/ instead of JSON.',
      },
      {
        name: 'app-folder',
        typeLabel: '{underline folder name}',
        description:
          'Run all tests in the specified folder in src/applications',
      },
      {
        name: 'path',
        typeLabel: '{underline glob}',
        description:
          'A file or glob to indicate which tests to run. This is the default option.',
        defaultOption: true,
      },
      {
        name: 'config',
        typeLabel: '{underline path}',
        description: 'Path to mocha config file. Defaults to config/mocha.json',
      },
      {
        name: 'reporter',
        typeLabel: '{underline name}',
        description: 'Mocha reporter to use (e.g., spec, dot, nyan)',
      },
      {
        name: 'full-suite',
        typeLabel: '{underline boolean}',
        description: 'Run the complete test suite (all tests)',
      },
      {
        name: 'changed-only',
        typeLabel: '{underline boolean}',
        description:
          'Run only tests for changed files (auto-detected from CHANGED_FILES env var). This is the default behavior in GitHub Actions.',
      },
      {
        name: 'per-directory',
        typeLabel: '{underline boolean}',
        description:
          'Run tests in separate mocha processes per directory. Useful for isolating failures and reducing memory usage.',
      },
      {
        name: 'help',
        typeLabel: '{underline boolean}',
        description: 'Show this usage guide',
      },
    ],
  },
];

module.exports = () => {
  console.log(commandLineUsage(helpSections));
};
