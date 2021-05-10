/* istanbul ignore file */
const moment = require('moment');

// var
const confirmedVA = require('./var/confirmed_va.json');
const confirmedCC = require('./var/confirmed_cc.json');
const requests = require('./var/requests.json');
const messages0190 = require('./var/messages_0190.json');
const messages0038 = require('./var/messages_0038.json');
const parentFacilities = require('./var/facilities.json');
const facilities983 = require('./var/facilities_983.json');
const facilities984 = require('./var/facilities_984.json');
const facilities983A6 = require('./var/facilities_983A6.json');
const clinicList983 = require('./var/clinicList983.json');
const clinicList612 = require('./var/clinicList612.json');
const facilityDetails983 = require('./var/facility_details_983.json');
const facilityDetails984 = require('./var/facility_details_984.json');
const facilityData = require('./var/facility_data.json');
const ccProviders = require('./var/cc_providers.json');
const sitesSupportingVAR = require('./var/sites-supporting-var.json');
const varSlots = require('./var/slots.json');
const cancelReasons = require('./var/cancel_reasons.json');
const requestEligibilityCriteria = require('./var/request_eligibility_criteria.json');
const directBookingEligibilityCriteria = require('./var/direct_booking_eligibility_criteria.json');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateMockSlots() {
  const times = [];
  const today = moment();
  const minuteSlots = ['00:00', '20:00', '40:00'];

  while (times.length < 300) {
    const daysToAdd = randomInt(1, 60);
    const date = today
      .clone()
      .add(daysToAdd, 'day')
      .format('YYYY-MM-DD');
    const hour = `0${randomInt(9, 16)}`.slice(-2);
    const minutes = minuteSlots[Math.floor(Math.random() * minuteSlots.length)];
    const startDateTime = `${date}T${hour}:${minutes}.000+00:00`;
    if (!times.includes(startDateTime)) {
      times.push(startDateTime);
    }
  }

  return times.sort().map(startDateTime => ({
    startDateTime,
    endDateTime: moment(startDateTime.replace('+00:00', ''))
      .add(20, 'minutes')
      .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
  }));
}

varSlots.data[0].attributes.appointmentTimeSlot = generateMockSlots();

/*
 * Handler definition:
 *
 * path: Can be a string or a regex. Strings match from the end of a url
 * delay: Value in ms to delay the response by
 * response: Can be a json object or a function
 * 
 * response function params:
 * url: the full url of the request
 * options.requestData: Parsed body data
 * options.groups: Any matched regex groups from the url
 */
module.exports = {
  'GET /vaos/v0/appointments': (req, res) => {
    if (req.params.type === 'cc') {
      return res.json(confirmedCC);
    } else {
      return res.json(confirmedVA);
    }
  },
  'GET /vaos/v0/appointments/va/:id': (req, res) => {
    return res.json({
      data: confirmedVA.data.find(appt => appt.id === req.params.id),
    });
  },
  'GET /vaos/v0/appointment_requests': requests,
  'GET /vaos/v0/appointment_requests/:id': (req, res) => {
    return res.json({
      data: requests.data.find(appt => appt.id === req.params.id),
    });
  },
  'GET /vaos/v0/appointment_requests/:id/messages': (req, res) => {
    const id = req.params.id;
    if (id === '8a48912a6c2409b9016c525a4d490190') {
      return res.json(messages0190);
    }

    if (id === '8a48912a6cab0202016cb4fcaa8b0038') {
      return res.json(messages0038);
    }

    return res.json({ data: [] });
  },
  'GET /vaos/v0/facilities': parentFacilities,
  'GET /vaos/v0/systems/:id/direct_scheduling_facilities': (req, res) => {
    if (req.params.parent_code === '984') {
      return res.json(facilities984);
    } else if (req.params.parent_code === '983A6') {
      return res.json(facilities983A6);
    } else {
      return res.json(facilities983);
    }
  },
  'GET /vaos/v0/community_care/eligibility/:id': (req, res) => {
    return res.json({
      data: {
        id: req.param.id,
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    });
  },
  'GET /vaos/v0/community_care/supported_sites': sitesSupportingVAR,
  'GET /vaos/v0/facilities/:id/visits/:type': (req, res) => {
    if (req.params.type === 'direct') {
      return res.json({
        data: {
          id: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 24,
            hasVisitedInPastMonths: !req.params.id.startsWith('984'),
          },
        },
      });
    }

    return res.json({
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes: {
          durationInMonths: 12,
          hasVisitedInPastMonths: !req.params.id.startsWith('984'),
        },
      },
    });
  },
  'GET /vaos/v0/facilities/limits': (req, res) => {
    const data = req.query.facility_ids.map(id => ({
      id,
      attributes: {
        numberOfRequests: id.startsWith('983') ? 0 : 1,
        requestLimit: 1,
        institutionCode: id,
      },
    }));

    return res.json({
      data,
    });
  },
  'GET /vaos/v0/facilities/:id/clinics': (req, res) => {
    if (req.params.id === '983') {
      return res.json(clinicList983);
    } else if (req.params.id.startsWith(612)) {
      return res.json(clinicList612);
    }

    return res.json({
      data: [],
    });
  },
  'GET /v1/facilities/va/:id': (req, res) => {
    if (req.params.id === 'vha_552') {
      return res.json(facilityDetails984);
    }

    return res.json(facilityDetails983);
  },
  'GET /v1/facilities/va': facilityData,
  'GET /v1/facilities/ccp': ccProviders,
  'GET /vaos/v0/facilities/:id/available_appointments': varSlots,
  'GET /vaos/v0/facilities/:id/cancel_reasons': cancelReasons,
  'GET /vaos/v0/request_eligibility_criteria': requestEligibilityCriteria,
  'GET /vaos/v0/direct_booking_eligibility_criteria': directBookingEligibilityCriteria,
  'GET /vaos/v0/preferences': { data: { attributes: { emailAllowed: true } } },
  'PUT /vaos/v0/appointments/cancel': {},
  'POST /vaos/v0/appointment_requests': {
    data: {
      id: 'testing',
      attributes: {},
    },
  },
  'PUT /vaos/v0/appointment_requests': (req, res) => {
    const requestAttributes = requests.data.find(
      item => item.id === req.body.id,
    ).attributes;

    return res.json({
      data: {
        id: req.body.id,
        attributes: {
          ...requestAttributes,
          status: 'Cancelled',
        },
      },
    });
  },
  'POST /vaos/v0/appointments': {},
  'POST /vaos/v0/appointment_requests/:id/messages': {
    data: {
      attributes: {},
    },
  },
  'PUT /vaos/v0/preferences': { data: { attributes: {} } },
};
