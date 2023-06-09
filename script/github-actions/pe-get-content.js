const core = require('@actions/core');

const mostRecent = process.env.MOST_RECENT_CONTENT;

const AWS_URL = `https://vetsgov-website-builds-s3-upload.s3-us-gov-west-1.amazonaws.com/${mostRecent}`;
const AWS_FILENAME = mostRecent.split('/').pop();

core.exportVariable('AWS_URL', AWS_URL);
core.exportVariable('AWS_FILENAME', AWS_FILENAME);
