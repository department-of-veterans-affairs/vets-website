const process = require('process');
const E2eHelpers = require('./e2e-helpers');
const Timeouts = require('./timeouts');
const mock = require('./mock-helpers');

function setUserToken(token, client) {
  client.execute((inToken) => {
    window.sessionStorage.userToken = inToken;
  },
  [token],
  (val) => {
    if (val.state !== 'success') {
      // eslint-disable-next-line no-console
      console.log(`Result of setting user token: ${JSON.stringify(val)}`);
    }
  });
}

function getLogoutUrl() {
  return 'http://example.com/fake_logout_url';
}

/* eslint-disable camelcase */
function initUserMock(token, level) {
  mock(token, {
    path: '/v0/user',
    verb: 'get',
    value: {
      data: {
        attributes: {
          profile: {
            email: 'fake@fake.com',
            loa: {
              current: level
            },
            first_name: 'Jane',
            middle_name: '',
            last_name: 'Doe',
            gender: 'F',
            birth_date: '1985-01-01'
          },
          veteran_status: {
            status: 'OK',
            is_veteran: true,
          },
          in_progress_forms: [{
            form: '1010ez',
            metadata: {}
          }],
          prefills_available: [],
          services: ['facilities', 'hca', 'edu-benefits', 'evss-claims', 'user-profile', 'rx', 'messaging'],
          health_terms_current: true,
          va_profile: {
            status: 'OK',
            birth_date: '19511118',
            family_name: 'Hunter',
            gender: 'M',
            given_names: ['Julio', 'E'],
            active_status: 'active'
          }
        }
      }
    }
  });
}

function initLogoutMock(token) {
  mock(token, {
    path: '/v0/sessions',
    verb: 'delete',
    value: {
      logout_via_get: getLogoutUrl()
    }
  });
}
/* eslint-enable camelcase */

function initLoginUrlsMock() {
  mock(null, {
    path: '/v0/sessions/authn_urls',
    verb: 'get',
    value: {
      idme: 'http://example.com/idme_url',
      dslogon: 'http://example.com/dslogon_url',
      mhv: 'http://example.com/mhv_url',
    }
  });
}

let tokenCounter = 0;

function getUserToken() {
  return `token-${process.pid}-${tokenCounter++}`;
}

function logIn(token, client, url, level) {
  initUserMock(token, level);
  initLogoutMock(token);
  initLoginUrlsMock(token);

  client
    .url(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  setUserToken(token, client);

  client
    .url(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  E2eHelpers.overrideSmoothScrolling(client);

  return client;
}

function testUnauthedUserFlow(client, path) {
  const token = getUserToken();
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  initLogoutMock(token);

  client
    .url(appURL)
    .waitForElementVisible('body', Timeouts.normal);

  initLoginUrlsMock();

  client
    .waitForElementVisible('.login', Timeouts.normal)
    .expect.element('h1').text.to.equal('Sign in to Vets.gov');
}

module.exports = {
  getLogoutUrl,
  getUserToken,
  initLogoutMock,
  initUserMock,
  logIn,
  testUnauthedUserFlow,
  setUserToken
};
