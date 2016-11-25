const request = require('request');
const E2eHelpers = require('./e2e-helpers');

const prescriptions = {
  data: [
    {
      id: '746575',
      type: 'va-rx-prescriptions',
      attributes: {
        prescriptionId: 746575,
        prescriptionNumber: '2719083',
        prescriptionName: 'ACETAMINOPHEN 325MG TAB',
        refillStatus: 'active',
        refillSubmitDate: null,
        refillDate: '2014-01-24T05:00:00.000Z',
        refillRemaining: 5,
        facilityName: 'ABC123',
        orderedDate: '2014-01-24T05:00:00.000Z',
        quantity: 10,
        expirationDate: '2015-01-25T05:00:00.000Z',
        dispensedDate: null,
        stationNumber: '12',
        isRefillable: false,
        isTrackable: false
      },
      links: {
        self: 'http://localhost:3000/rx/v1/prescriptions/746575',
        tracking: 'http://localhost:3000/rx/v1/prescriptions/746575/trackings'
      }
    }
  ],
  meta: {
    sort: {
      prescriptionName: 'ASC'
    },
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 1
    }
  }
};

// Create API routes
function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/prescriptions/active',
      verb: 'get',
      value: prescriptions
    }
  });

  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/prescriptions',
      verb: 'get',
      value: prescriptions
    }
  });
}

module.exports = {
  prescriptions,
  initApplicationSubmitMock
};
