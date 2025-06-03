const sentryTestkit = require('sentry-testkit');

const { testkit, sentryTransport } = sentryTestkit();

module.exports = { testkit, sentryTransport };
