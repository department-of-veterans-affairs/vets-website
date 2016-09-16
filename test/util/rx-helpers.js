const request = require('request');
const E2eHelpers = require('./e2e-helpers');

// Disable eslint for JSON
/* eslint-disable */
const prescriptions = {
  "data":[
    {
      "id":"746575",
      "type":"va-rx-prescriptions",
      "attributes":{
        "prescription-id":746575,
        "prescription-number":"2719083",
        "prescription-name":"ACETAMINOPHEN 325MG TAB",
        "refill-submit-date":null,
        "refill-date":"2014-01-24T05:00:00.000Z",
        "refill-remaining":5,
        "facility-name":"ABC123",
        "ordered-date":"2014-01-24T05:00:00.000Z",
        "quantity":10,
        "expiration-date":"2015-01-25T05:00:00.000Z",
        "dispensed-date":null,
        "station-number":"12",
        "is-refillable":false,
        "is-trackable":false
      },
      "links":{
        "self":"http://localhost:3000/rx/v1/prescriptions/746575",
        "tracking":"http://localhost:3000/rx/v1/prescriptions/746575/trackings"
      }
    }
  ]
};
/* eslint-enable */

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/rx-api/prescriptions',
      verb: 'get',
      value: prescriptions
    }
  });
}

module.exports = {
  prescriptions,
  initApplicationSubmitMock
};
