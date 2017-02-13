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
          services: ['facilities', 'hca', 'edu-benefits', 'evss-claims', 'user-profile', 'rx', 'messaging'],
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
/* eslint-enable camelcase */

let tokenCounter = 0;

function getUserToken() {
  return `token-${process.pid}-${tokenCounter++}`;
}

function logIn(token, client, url, level) {
  initUserMock(token, level);

  client
    .url(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  setUserToken(token, client);

  client
    .url(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);

  return client;
}

module.exports = {
  getUserToken,
  logIn
};
