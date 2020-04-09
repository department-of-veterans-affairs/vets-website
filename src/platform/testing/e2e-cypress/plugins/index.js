// eslint-disable-next-line
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs');
const join = require('path').join;

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    readDirMaybe(path) {
      return fs.readdirSync(path);
    },
  });

  on('task', {
    getTestDataSets(input) {
      return fs
        .readdirSync(`${input.path}`)
        .filter(fileName => fileName.endsWith(input.rules.extension))
        .filter(
          fileName =>
            Array.isArray(input.rules.only)
              ? input.rules.only.includes(fileName)
              : true,
        )
        .filter(
          fileName =>
            Array.isArray(input.rules.ignore)
              ? !input.rules.ignore.includes(fileName)
              : true,
        )
        .map(fileName => ({
          fileName,
          contents: JSON.parse(
            fs.readFileSync(join(input.path, fileName), 'utf8'),
          ),
        }));
    },
  });
};
