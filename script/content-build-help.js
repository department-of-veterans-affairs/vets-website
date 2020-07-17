/* eslint-disable no-console */
const path = require('path');
const commandLineUsage = require('command-line-usage');

const parentDir = path.resolve(__dirname, '../../');
const defaultContentDir = path.join(parentDir, 'vagov-content');
const defaultCmsExportDir = path.join(parentDir, 'cms-export/content');

const helpSections = [
  {
    header: 'Options',
    optionList: [
      {
        name: 'buildtype',
        type: String,
        description:
          'Use a specific buildtype.\nOptions include {bold localhost} (default), {bold vagovdev}, {bold vagovstaging}, {bold vagovprod}.',
      },
      {
        name: 'watch',
        type: Boolean,
        description: 'Rebuild content when a template change is detected.',
      },
      {
        name: 'destination',
        type: String,
        description: 'Specify a directory to write the build output.',
      },
      {
        name: 'asset-source',
        type: String,
        description:
          'Tell the build where to pull the application assets from.\nOptions include {bold local} (default), {bold deployed}, or a {bold vets-website commit hash}.',
      },
      {
        name: 'content-directory',
        type: String,
        description: `Tell the build where to find the vagov-content repo.\nDefaults to {underline ${defaultContentDir}}`,
      },
      {
        name: 'pull-drupal',
        type: Boolean,
        description:
          'Pull the latest content from Drupal. If false, the build will try to use the local cache found in .cache/',
      },
      {
        name: 'use-cms-export',
        type: Boolean,
        description:
          'Use the CMS export instead of GraphQL to fetch the content nodes.',
      },
      {
        name: 'cms-export-dir',
        type: String,
        description: `Specify where to find the CMS export.\nDefaults to {underline ${defaultCmsExportDir}}`,
      },
      {
        name: 'drupal-fail-fast',
        type: Boolean,
        description: 'Fail the build quickly if an error is encountered.',
      },
      {
        name: 'drupal-address',
        type: String,
        description:
          'Specify the address of the Drupal server to pull the content from.',
      },
      {
        name: 'drupal-user',
        type: String,
        description:
          'Specify the user to authenticate as when querying the Drupal server.',
      },
      {
        name: 'drupal-password',
        type: String,
        description: 'Specify the password for the --drupal-user.',
      },
      {
        name: 'no-drupal-proxy',
        type: Boolean,
        description:
          "Don't use the SOCKS proxy when connecting to the Drupal server.",
      },
      {
        name: 'accessibility',
        type: Boolean,
        description: 'Inject the aXe checker into all HTML files.',
      },
      {
        name: 'lint-plain-language',
        type: Boolean,
        description: 'Lint HTML files for plain language.',
      },
    ],
  },
];

const printBuildHelp = () => {
  console.log(commandLineUsage(helpSections));
};

module.exports = printBuildHelp;
