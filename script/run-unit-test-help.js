/* eslint-disable no-console */
const commandLineUsage = require('command-line-usage');

const helpSections = [
  {
    header: 'Unit test run script',
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
          'Runs the unit tests with code coverage metrics, and outputs the results to an json report in coverage/',
      },
      {
        name: 'coverage-html',
        typeLabel: '{underline boolean}',
        description:
          'Used in conjunction with `--coverage` Runs the unit tests with code coverage metrics, and outputs the results to an html report in coverage/ instead of json.',
      },
      {
        name: 'app-folder',
        typeLabel: '{underline folder name}',
        description:
          'Run all tests in the specified folder in src/applications',
        defaultOption: true,
      },
      {
        name: 'path',
        typeLabel: '{underline glob}',
        description:
          'A file or glob to indicate which tests to run. This is the default option.',
        defaultOption: true,
      },
      {
        name: 'help',
        typeLabel: '{underline boolean}',
        description: 'Show the usage guide',
      },
    ],
  },
];

module.exports = () => {
  console.log(commandLineUsage(helpSections));
};
