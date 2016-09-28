const request = require('request');
const E2eHelpers = require('./e2e-helpers');

// Disable eslint for JSON
/* eslint-disable */
//TODO: add example api response
const data = {};
/* eslint-enable */

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/api/v0/education_benefits_claims',
      verb: 'post',
      value: data
    }
  });
}

module.exports = {
  data,
  initApplicationSubmitMock
};
