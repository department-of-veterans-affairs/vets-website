const process = require('process');
const E2eHelpers = require('./helpers');
const Timeouts = require('./timeouts');
const mock = require('./mock-helpers');
const VA_FORM_IDS = require('platform/forms/constants').VA_FORM_IDS;

const logoutRequestUrl = '/sessions/slo/new';

function setUserSession(token, client) {
  client.setCookie({ name: 'token', value: token, httpOnly: true });
  client.execute(
    () => {
      window.localStorage.setItem('hasSession', true);
    },
    [],
    val => {
      if (val.state !== 'success') {
        // eslint-disable-next-line no-console
        console.log(`Result of setting user token: ${JSON.stringify(val)}`);
      }
    },
  );
}

/* eslint-disable camelcase */
function getDefaultUserResponse(level) {
  return {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: level },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: level === 3,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {},
          },
        ],
        prefills_available: [
          VA_FORM_IDS.FORM_21_526EZ,
          VA_FORM_IDS.FORM_22_0994,
        ],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
          'form-save-in-progress',
          'form-prefill',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
          active_status: 'active',
        },
      },
    },
  };
}

function initUserMock(token, level, userData) {
  mock(token, {
    path: '/v0/user',
    verb: 'get',
    value: userData || getDefaultUserResponse(level),
  });
}
/* eslint-enable camelcase */

let tokenCounter = 0;

function getUserToken() {
  return `token-${process.pid}-${tokenCounter++}`;
}

function logIn(token, client, url, level, userData) {
  initUserMock(token, level, userData);

  client
    .openUrl(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  E2eHelpers.disableAnnouncements(client);
  setUserSession(token, client);

  client
    .openUrl(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  E2eHelpers.overrideSmoothScrolling(client);

  return client;
}

function testUnauthedUserFlow(client, path) {
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  client.openUrl(appURL).waitForElementVisible('body', Timeouts.normal);

  client
    .waitForElementVisible('.login', Timeouts.normal)
    .expect.element('h1')
    .text.to.equal('Sign in to VA.gov');
}

module.exports = {
  getUserToken,
  getDefaultUserResponse,
  initUserMock,
  logIn,
  logoutRequestUrl,
  testUnauthedUserFlow,
  setUserSession,
};
