const request = require('request');
const E2eHelpers = require('./e2e-helpers');
// const Timeouts = require('../util/timeouts.js');

function initClaimsListMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/v0/disability_claims',
      verb: 'get',
      value: {
        data: [
          {
            id: '11',
            type: 'disability_claims',
            attributes: {
              evssId: 189685,
              dateFiled: '2008-09-23',
              minEstDate: '2013-05-02',
              maxEstDate: '2014-01-02',
              phaseChangeDate: '2012-10-31',
              open: false,
              waiverSubmitted: false,
              documentsNeeded: true,
              developmentLetterSent: true,
              decisionLetterSent: true,
              successfulSync: false,
              updatedAt: '2016-10-28T14:41:26.468Z',
              phase: null
            }
          },
          {
            id: '11',
            type: 'disability_claims',
            attributes: {
              evssId: 189685,
              dateFiled: '2008-09-23',
              minEstDate: '2013-05-02',
              maxEstDate: '2014-01-02',
              phaseChangeDate: '2012-10-31',
              open: false,
              waiverSubmitted: false,
              documentsNeeded: true,
              developmentLetterSent: true,
              decisionLetterSent: true,
              successfulSync: false,
              updatedAt: '2016-10-28T14:41:26.468Z',
              phase: null
            }
          }
        ]
      }
    }
  });
}

module.exports = {
  initClaimsListMock
};
