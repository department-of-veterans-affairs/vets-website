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
        "prescriptionId":746575,
        "prescriptionNumber":"2719083",
        "prescriptionName":"ACETAMINOPHEN 325MG TAB",
        "refillSubmitDate":null,
        "refillDate":"2014-01-24T05:00:00.000Z",
        "refillRemaining":5,
        "facilityName":"ABC123",
        "orderedDate":"2014-01-24T05:00:00.000Z",
        "quantity":10,
        "expirationDate":"2015-01-25T05:00:00.000Z",
        "dispensedDate":null,
        "stationNumber":"12",
        "isRefillable":false,
        "isTrackable":false
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
