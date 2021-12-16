const Timeouts = require('./timeouts');

const BASE_URL = `http://${process.env.WEB_HOST || 'localhost'}:${process.env
  .WEB_PORT || 3333}`;

const API_URL = `http://${process.env.API_HOST || 'localhost'}:${process.env
  .API_PORT || 3000}`;

function overrideVetsGovApi(client) {
  client.execute(
    url => {
      const current = window.VetsGov || {};
      window.VetsGov = Object.assign({}, current, {
        api: {
          // eslint-disable-next-line object-shorthand
          url: url,
        },
      });
      return window.VetsGov;
    },
    [`http://${process.env.API_HOST}:${process.env.API_PORT || 3000}`],
  );
}

function overrideSmoothScrolling(client) {
  client.execute(() => {
    const current = window.VetsGov || {};
    window.VetsGov = Object.assign({}, current, {
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false,
      },
    });
    return window.VetsGov;
  });
}

function disableAnnouncements(client) {
  client.execute(() => {
    window.localStorage.setItem('DISMISSED_ANNOUNCEMENTS', '*');
  });
}

// Returns an object suitable for a nightwatch test case.
//
// Provides test framework maintainers a single entry point for annotating all tests with things
// like uniform reporters.
//
// @param {beginApplication} Callable taking one argument, client, that runs the e2e test.
function createE2eTest(beginApplication) {
  return {
    'Begin application': client => {
      client.openUrl(BASE_URL);
      overrideSmoothScrolling(client);
      disableAnnouncements(client);
      beginApplication(client);
      client.end();
    },
  };
}

// Expects navigation lands at a path with the given `urlSubstring`.
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect
    .element('.js-test-location')
    .attribute('data-location')
    .to.not.contain(urlSubstring)
    .before(Timeouts.slow);
}

module.exports = {
  baseUrl: BASE_URL,
  apiUrl: API_URL,
  createE2eTest,
  disableAnnouncements,
  expectNavigateAwayFrom,
  overrideVetsGovApi,
  overrideSmoothScrolling,
};
