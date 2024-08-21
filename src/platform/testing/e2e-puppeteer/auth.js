const process = require('process');
const { expect } = require('chai');
const { VA_FORM_IDS } = require('platform/forms/constants');
const E2eHelpers = require('./helpers');
const Timeouts = require('../e2e/timeouts');
const mock = require('../e2e/mock-helpers');

const logoutRequestUrl = '/sessions/slo/new';

async function setUserSession(token, client) {
  client.setCookie({ name: 'token', value: token, httpOnly: true });
  client.evaluate(
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
function initUserMock(token, level) {
  mock(token, {
    path: '/v0/user',
    verb: 'get',
    value: {
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
          prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
          services: [
            'facilities',
            'hca',
            'edu-benefits',
            'evss-claims',
            'form526',
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
      meta: { errors: null },
    },
  });
}
/* eslint-enable camelcase */

let tokenCounter = 0;

function getUserToken() {
  // eslint-disable-next-line no-plusplus
  return `token-${process.pid}-${tokenCounter++}`;
}

async function logIn(token, client, url, level) {
  initUserMock(token, level);
  const newUrl = `${E2eHelpers.baseUrl}${url}`;
  await client.waitForSelector('body', { timeout: Timeouts.normal });
  await client.goto(newUrl);
  await E2eHelpers.disableAnnouncements(client);
  await setUserSession(token, client);
  await client.goto(`${E2eHelpers.baseUrl}${url}`);
  await client.evaluate(() => {
    const current = window.VetsGov || {};
    window.VetsGov = {
      ...current,
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false,
      },
    };
    return window.VetsGov;
  });
}

async function testUnauthedUserFlow(client, path) {
  const appURL = `${E2eHelpers.baseUrl}${path}`;

  await client.goto(appURL);
  await client.waitForSelector('body', { timeout: Timeouts.normal });

  await client.waitForSelector('.login', { timeout: Timeouts.normal });
  expect(client.$eval('h1', node => node.innerText)).to.equal('Sign in');
}

module.exports = {
  getUserToken,
  initUserMock,
  logIn,
  logoutRequestUrl,
  testUnauthedUserFlow,
  setUserSession,
};
