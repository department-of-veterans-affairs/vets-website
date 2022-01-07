/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const omit = require('lodash/omit');
const commandLineArgs = require('command-line-args');

const {
  buildGraph,
  dedupeGraph,
} = require('./github-actions/select-cypress-tests.js');

const options = commandLineArgs([{ name: 'app-folder', type: String }]);

const appFolder = options['app-folder'];
if (!appFolder) throw new Error('App folder not specified.');

const appPath = path.join(__dirname, `../src/applications/${appFolder}`);
if (!fs.existsSync(appPath)) throw new Error(`${appPath} does not exist.`);

// Suppress errors from 'find-imports' when building graph
console.error = () => {};
console.log('Analyzing app imports...');
const graph = dedupeGraph(buildGraph());

const imports = graph[appFolder];

console.log(JSON.stringify(omit(imports, 'appsToTest'), null, 2));
