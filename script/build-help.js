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
          'Build only comma-delimited a subset of applications. Entry names can be found in the manifest.json files.\nE.g. {bold static-pages,auth}',
      },
      {
        name: 'env.buildtype',
        typeLabel: '{underline string}',
        description:
          'Use a specific buildtype.\nOptions include {bold localhost} (default), {bold vagovdev}, {bold vagovstaging}, {bold vagovprod}.',
      },
      {
        name: 'env.api',
        typeLabel: '{underline string}',
        description:
          'Point vets-website to a running api.\nE.g. {bold https://sandbox-api.va.gov}. Defaults to {bold http://localhost:3000}.',
      },
      {
        name: 'env.host',
        typeLabel: '{underline IP}',
        description:
          'Specify a different host. Use with --env.public to serve the website to your local network.\nE.g. {bold 0.0.0.0}',
      },
      {
        name: 'env.port',
        typeLabel: '{underline number}',
        description: 'Run on a specific port. Defaults to {bold 3001}.',
      },
      {
        name: 'env.public',
        typeLabel: '{underline IP}',
        description:
          "Serve the website to your local network by setting this to your machine's IP address.\nE.g. {bold 192.168.0.111}\nUse with --env.host 0.0.0.0",
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
      {
        desc: '2. Serve the website to devices on your local network',
        example: '$ yarn watch --env.host 0.0.0.0 --env.public 192.168.0.111',
      },
    ],
  },
];

const printBuildHelp = () => {
  console.log(commandLineUsage(helpSections));
};

module.exports = printBuildHelp;
