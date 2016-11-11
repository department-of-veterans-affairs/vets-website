const request = require('request');
const E2eHelpers = require('./e2e-helpers');
const Timeouts = require('./timeouts');

function setUserToken(client) {
  client.execute(() => {
    window.sessionStorage.userToken = '1234567';
  },
  [],
  (val) => {
    // eslint-disable-next-line no-console
    console.log(`Result of setting user token: ${JSON.stringify(val)}`);
  });
}

/* eslint-disable camelcase */
function initUserMock(level) {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
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
            services: ['facilities', 'hca', 'edu-benefits', 'disability-benefits', 'user-profile', 'rx', 'messaging'],
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
    }
  });
}
/* eslint-enable camelcase */

function logIn(client, url, level) {
  initUserMock(level);
  client
    .url(`${E2eHelpers.baseUrl}${url}`)
    .waitForElementVisible('body', Timeouts.normal);
  setUserToken(client);
}

module.exports = {
  setUserToken,
  initUserMock,
  logIn
};
