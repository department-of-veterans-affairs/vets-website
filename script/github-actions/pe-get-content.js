const core = require('@actions/core');

core.exportVariable(
  'AWS_URL',
  process.env.MOST_RECENT_CONTENT.substring(
    0,
    process.env.MOST_RECENT_CONTENT.lastIndexOf('/'),
  ),
);
