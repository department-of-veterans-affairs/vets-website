const commandLineArgs = require('command-line-args');
const path = require('path');
const matter = require('gray-matter');
const express = require('express');
const octokit = require('@octokit/rest')();
const createPipieline = require('../src/site/stages/preview');

const getDrupalClient = require('../src/site/stages/build/drupal/api');
const GET_PAGE_BY_ID = require('../src/site/stages/build/drupal/get-page-by-id.graphql');

const ENVIRONMENTS = require('../src/site/constants/environments');
const HOSTNAMES = require('../src/site/constants/hostnames');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const defaultHost = HOSTNAMES[defaultBuildtype];
const defaultContentDir = '../../../../../vagov-content/pages';

const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'buildpath', type: String, defaultValue: 'build/localhost' },
  { name: 'host', type: String, defaultValue: defaultHost },
  { name: 'port', type: Number, defaultValue: process.env.PORT || 3001 },
  { name: 'entry', type: String, defaultValue: null },
  { name: 'protocol', type: String, defaultValue: 'http' },
  { name: 'destination', type: String, defaultValue: null },
  { name: 'content-directory', type: String, defaultValue: defaultContentDir },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.unexpected && options.unexpected.length !== 0) {
  throw new Error(`Unexpected arguments: '${options.unexpected}'`);
}

const app = express();
const drupalClient = getDrupalClient(options);

app.use(express.static(path.join(__dirname, '..', options.buildpath)));

app.use('/preview', async (req, res) => {
  const smith = createPipieline({
    ...options,
    port: process.env.PORT,
  });

  const contentId = req.query.contentId;
  const drupalPage = await drupalClient.query({
    query: GET_PAGE_BY_ID,
    variables: { path: contentId },
  });

  const wasFoundInDrupal = !!drupalPage.data.route;

  if (wasFoundInDrupal) {
    // Once we have Metalsmith templating in place for Drupal data, we should
    // use that instead of the GH data.
    res.json(drupalPage);
    return;
  }

  octokit.repos
    .getContents({
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

app.listen(options.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Content preview server running on port ${options.port}`);
});
