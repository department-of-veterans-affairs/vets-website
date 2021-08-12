/* eslint-disable no-console */
const commandLineUsage = require('command-line-usage');

const helpSections = [
  {
    header: 'Options',
    optionList: [
      {
        name: 'dir',
        typeLabel: '{underline string}',
        description:
          'The directory to search for JSX files using the matching component',
      },
      {
        name: 'component',
        typeLabel: '{underline string}',
        description:
          'The name of the React component from {bold component-library} you wish to migrate',
      },
    ],
  },
];

const printMigrationHelp = () => {
  console.log(commandLineUsage(helpSections));
};

module.exports = printMigrationHelp;
