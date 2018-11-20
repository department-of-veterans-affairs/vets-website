'use strict'; // eslint-disable-line

// Simple test server to serve up the build files.

// This is used over a bear http-server invocation because it handles paths inside React apps
// using the expression-history-api-fallback option.

const commandLineArgs = require('command-line-args');
const path = require('path');
const matter = require('gray-matter');
const express = require('express');
const octokit = require('@octokit/rest')();
const createPipieline = require('./preview-build');

const ENVIRONMENTS = require('../src/site/stages/constants/environments');
const HOSTNAMES = require('../src/site/stages/constants/hostnames');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'buildpath', type: String, defaultValue: '../build/localhost' },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: 3001 },
  { name: 'watch', type: Boolean, defaultValue: false },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'analyzer', type: Boolean, defaultValue: false },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'public', type: String, defaultValue: null },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-deployment', type: Boolean, defaultValue: false },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

const app = express();

// eslint-disable-next-line
console.log(path.join(__dirname, '..', options.buildpath));

app.use(express.static(path.join(__dirname, '..', options.buildpath)));

app.use('/content', (req, res) => {
  const smith = createPipieline({
    ...options,
    port: process.env.PORT,
  });

  const contentId = req.query.contentId;

  octokit.repos
    .getContent({
      owner: 'department-of-veterans-affairs',
      repo: 'vagov-content',
      path: `/pages/${contentId}`,
    })
    .then(result => Buffer.from(result.data.content, result.data.encoding))
    .then(matter)
    .then(parsedContent => {
      const files = {
        [contentId]: Object.assign(parsedContent.data, {
          path: contentId,
          contents: new Buffer(parsedContent.content),
        }),
      };

      smith.run(files, (err, newFiles) => {
        if (err) throw err;
        res.set('Content-Type', 'text/html');
        // This will actually need to convert a md path to an html path, probably
        res.send(Object.entries(newFiles)[0][1].contents);
      });
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.sendStatus(500);
    });
});

app.listen(process.env.PORT || options.port, () => {
  // eslint-disable-next-line no-console
  console.log('Content preview server running');
});
