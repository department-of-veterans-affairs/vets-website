/* eslint-disable no-console */
const commandLineUsage = require('command-line-usage');

const helpSections = [
  {
    header: 'Options',
    optionList: [
      {
        name: 'env.entry',
        typeLabel: '{underline string}',
        description:
          'Build only a subset of applications. Uses a comma-delimited string. Entry names can be found in the manifest.json files.',
      },
      {
        name: 'env.buildtype',
        typeLabel: '{underline string}',
        description:
          'Use a specific buildtype. Options include localhost (default), vagovdev, vagovstaging, vagovprod.',
      },
      {
        name: 'env.api',
        typeLabel: '{underline string}',
        description:
          'Point vets-website to a running api. E.g. https://dev-api.va.gov. Defaults to http://localhost:3000.',
      },
      {
        name: 'env.host',
        typeLabel: '{underline IP}',
        description: 'Specify a different host.',
      },
      {
        name: 'env.port',
        typeLabel: '{underline number}',
        description: 'Run on a specific port. Defaults to 3001.',
      },
      {
        name: 'env.public',
        typeLabel: '{underline IP}',
        description:
          "Serve the website to your local network by setting this to your machine's IP address. E.g. 192.168.0.111",
      },
    ],
  },
  {
    header: 'Pro tips',
    content: [
      {
        desc:
          "1. Build the static HTML pages once before running the webpack-dev-server to see your application's landing page as it would appear on VA.gov.",
        example: '$ yarn build:content',
      },
    ],
  },
];

const printBuildHelp = () => {
  console.log(commandLineUsage(helpSections));
};

module.exports = printBuildHelp;
