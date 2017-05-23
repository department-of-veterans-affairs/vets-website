const request = require('request');
const E2eHelpers = require('./e2e-helpers');

function mock(token, json) {
  const jsonWithToken = token ? {
    ...json, auth: `Token token=${token}`
  } : json;

  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: jsonWithToken
  });
}

module.exports = mock;
