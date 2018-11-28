const process = require('process');
const E2eHelpers = require('./helpers');
const Timeouts = require('../e2e/timeouts');
const mock = require('../e2e/mock-helpers');
const expect = require('chai').expect;

async function setUserToken(token, client) {
  await client.evaluate(
    inToken => {
      window.sessionStorage.setItem('userToken', inToken);
    },
    [token],
    val => {
      if (val.state !== 'success') {
        // eslint-disable-next-line no-console
        console.log(`Result of setting user token: ${JSON.stringify(val)}`);
      }
    },
  );
}

function getLogoutUrl() {
  return 'http://example.com/logout_url';
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
            authn_context: 'idme',
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
              form: '1010ez',
              metadata: {},
            },
          ],
          prefills_available: [],
          services: [
            'facilities',
            'hca',
            'edu-benefits',
            'evss-claims',
            'user-profile',
            'health-records',
            'rx',
            'messaging',
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
    },
  });
}
/* eslint-enable camelcase */

function initLogoutMock(token) {
  mock(token, {
    path: '/sessions/slo/new',
    verb: 'get',
    value: {
      url: getLogoutUrl(),
    },
  });
}

let tokenCounter = 0;

function getUserToken() {
  return `token-${process.pid}-${tokenCounter++}`;
}

async function logIn(token, client, url, level) {
  initUserMock(token, level);
  initLogoutMock(token);

  const newUrl = `${E2eHelpers.baseUrl}${url}`;
  await client.waitForSelector('body', { timeout: Timeouts.normal });
  await client.goto(newUrl);
  await E2eHelpers.disableAnnouncements(client);
  await setUserToken(token, client);
  await client.goto(`${E2eHelpers.baseUrl}${url}`);
  await client.evaluate(() => {
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

async function testUnauthedUserFlow(client, path) {
  const token = getUserToken();
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  initLogoutMock(token);

  await client.goto(appURL);
  await client.waitForSelector('body', { timeout: Timeouts.normal });

  await client.waitForSelector('.login', { timeout: Timeouts.normal });
  expect(client.$eval('h1', node => node.innerText)).to.equal(
    'Sign in to Vets.gov',
  );
}

module.exports = {
  getLogoutUrl,
  getUserToken,
  initLogoutMock,
  initUserMock,
  logIn,
  testUnauthedUserFlow,
  setUserToken,
};
