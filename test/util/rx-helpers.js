const request = require('request');
const E2eHelpers = require('./e2e-helpers');

const testValues = {
};

function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/api/rx/v1/application',
      verb: 'post',
      value: {
      }
    }
  });
}

module.exports = {
  testValues,
  initApplicationSubmitMock
};
