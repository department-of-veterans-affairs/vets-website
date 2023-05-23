const core = require('@actions/core');

const mostRecent = process.env.MOST_RECENT_CONTENT;

const AWS_URL = `https://vetsgov-website-builds-s3-upload.s3-us-gov-west-1.amazonaws.com/${mostRecent}`;

core.exportVariable('AWS_URL', AWS_URL);
