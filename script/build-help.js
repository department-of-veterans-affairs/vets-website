/* eslint-disable no-console */
const commandLineUsage = require('command-line-usage');

const helpSections = [
  {
    header: 'Options',
    optionList: [
      {
        name: 'env entry',
        typeLabel: '{underline string}',
        description:
          'Build only comma-delimited a subset of applications. Entry names can be found in the manifest.json files.\nE.g. {bold static-pages,auth}',
      },
      {
        name: 'env buildtype',
        typeLabel: '{underline string}',
        description:
          'Use a specific buildtype.\nOptions include {bold localhost} (default), {bold vagovdev}, {bold vagovstaging}, {bold vagovprod}.',
      },
      {
        name: 'env api',
        typeLabel: '{underline string}',
        description:
          'Point vets-website to a running api.\nE.g. {bold https://dev-api.va.gov}. Defaults to {bold http://localhost:3000}.',
      },
      {
        name: 'env host',
        typeLabel: '{underline IP}',
        description:
          'Specify a different host. Use with --env public to serve the website to your local network.\nE.g. {bold 0.0.0.0}',
      },
      {
        name: 'env port',
        typeLabel: '{underline number}',
        description: 'Run on a specific port. Defaults to {bold 3001}.',
      },
      {
        name: 'env public',
        typeLabel: '{underline IP}',
        description:
          "Serve the website to your local network by setting this to your machine's IP address.\nE.g. {bold 192.168.0.111}\nUse with --env host=0.0.0.0",
      },
      {
        name: 'env scaffold',
        type: Boolean,
        description:
          'Automatically generate application landing pages. Can be used as an alternative to running a full content build.',
      },
      {
        name: 'env memory',
        type: Number,
        description:
          'Set NODE_OPTION --max-old-space-size to: 1024, 2048, 3072, 4096, 5120, 6144, 7168, or 8192 (e.g. --env memory=8192)',
      },
      {
        name: 'env openTo',
        typeLabel: '{underline URL}',
        description:
          'The path to open the browser to when --env scaffold is true. {dim --env openTo=path/to/my/app} will open the browser to {underline http://localhost:3001/path/to/my/app}. Defaults to the either the rootUrl of an app in --env entry or the home page.',
      },
    ],
  },
  {
    header: 'Pro tips',
    content: [
      {
        desc: '1. Serve the website to devices on your local network',
        example: '$ yarn watch --env host=0.0.0.0 --env public=192.168.0.111',
      },
    ],
  },
];

const printBuildHelp = () => {
  console.log(commandLineUsage(helpSections));
};

module.exports = printBuildHelp;
