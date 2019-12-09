/* eslint-disable no-param-reassign */
const moment = require('moment');
const mock = require('../../../../platform/testing/e2e/mock-helpers');

const confirmedVA = require('../../api/confirmed_va.json');
const confirmedCC = require('../../api/confirmed_cc.json');
const requests = require('../../api/requests.json');
const cancelReasons = require('../../api/cancel_reasons.json');
const systems = require('../../api/systems.json');

function updateConfirmedVADates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(3, 'days')
      .toISOString();

    item.attributes.startDate = futureDateStr;
    if (item.attributes.vdsAppointments[0]) {
      item.attributes.vdsAppointments[0].appointmentTime = futureDateStr;
    } else {
      item.attributes.vvsAppointments[0].dateTime = futureDateStr;
    }
  });
  return data;
}

function updateConfirmedCCDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(4, 'days')
      .format('MM/DD/YYYY HH:mm:ss');

    item.attributes.appointmentTime = futureDateStr;
  });
  return data;
}

function updateRequestDates(data) {
  data.data.forEach(item => {
    const futureDateStr = moment()
      .add(5, 'days')
      .format('MM/DD/YYYY');

    item.attributes.optionDate1 = futureDateStr;
  });
  return data;
}

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
    path: '/v0/vaos/systems',
    verb: 'get',
    value: systems,
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=va',
    value: updateConfirmedVADates(confirmedVA),
  });
  mock(token, {
    path: '/v0/vaos/appointments',
    verb: 'get',
    query: 'type=cc',
    value: updateConfirmedCCDates(confirmedCC),
  });
  mock(token, {
    path: '/v0/vaos/appointment_requests',
    verb: 'get',
    value: updateRequestDates(requests),
  });
  mock(token, {
    path: '/v0/vaos/appointments/cancel',
    verb: 'put',
    value: '',
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
