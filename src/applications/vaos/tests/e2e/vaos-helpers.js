const mock = require('../../../../platform/testing/e2e/mock-helpers');

const confirmedVA = require('../../api/confirmed_va.json');
const confirmedCC = require('../../api/confirmed_cc.json');
const requests = require('../../api/requests.json');
const cancelReasons = require('../../api/cancel_reasons.json');

function initAppointmentListMock(token) {
  mock(token, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [
          {
            name: 'vaOnlineScheduling',
            value: true,
          },
          {
            name: 'vaOnlineSchedulingCancel',
            value: true,
          },
        ],
      },
    },
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=va',
    value: confirmedVA,
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=cc',
    value: confirmedCC,
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'get',
    value: requests,
  });
  mock(token, {
    path: '/v0/vaos/facilities/983/cancel_reasons',
    verb: 'get',
    value: cancelReasons,
  });
}

module.exports = {
  initAppointmentListMock,
};
