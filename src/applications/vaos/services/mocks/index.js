/* istanbul ignore file */
import moment from 'moment';
import set from 'platform/utilities/data/set';

// fhir
import healthcareService983 from './fhir/mock_healthcare_system_983.json';
import healthcareService984 from './fhir/mock_healthcare_system_984.json';
import locations983 from './fhir/mock_locations_983.json';
import locations984 from './fhir/mock_locations_984.json';
import organization from './fhir/mock_organizations.json';
import fhirSlots from './fhir/mock_slots.json';

// var
import confirmedVA from './var/confirmed_va.json';
import confirmedCC from './var/confirmed_cc.json';
import requests from './var/requests.json';
import messages0190 from './var/messages_0190.json';
import messages0038 from './var/messages_0038.json';
import parentFacilities from './var/facilities.json';
import expressCareFacilities983 from './var/facilities_983_express_care.json';
import expressCareFacilities984 from './var/facilities_984_express_care.json';
import facilities983 from './var/facilities_983.json';
import facilities984 from './var/facilities_984.json';
import facilities983A6 from './var/facilities_983A6.json';
import clinicList983 from './var/clinicList983.json';
import clinicList612 from './var/clinicList612.json';
import facilityDetails983 from './var/facility_details_983.json';
import facilityDetails984 from './var/facility_details_984.json';
import facilityData from './var/facility_data.json';
import ccProviders from './var/cc_providers.json';
import sitesSupportingVAR from './var/sites-supporting-var.json';
import varSlots from './var/slots.json';
import cancelReasons from './var/cancel_reasons.json';
import requestEligibilityCriteria from './var/request_eligibility_criteria.json';
import directBookingEligibilityCriteria from './var/direct_booking_eligibility_criteria.json';
import { EXPRESS_CARE, FREE_BUSY_TYPES } from '../../utils/constants';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateMockSlots() {
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

export function generateMockFHIRSlots() {
  const times = [];
  const today = moment();
  const minuteSlots = [0, 20, 40];

  while (times.length < 300) {
    const minutes = minuteSlots[Math.floor(Math.random() * minuteSlots.length)];
    const startDateTime = today
      .clone()
      .add(randomInt(1, 60), 'day')
      .hour(randomInt(9, 16))
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toISOString();
    if (!times.includes(startDateTime)) {
      times.push(startDateTime);
    }
  }

  return times.sort().map(start => ({
    resource: {
      start,
      end: moment(start)
        .add(20, 'minutes')
        .toISOString(),
      overbooked: false,
      freeBusyType: FREE_BUSY_TYPES.free,
    },
  }));
}
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
export default [
  {
    path: /vaos\/v0\/appointments.*type=cc.*/,
    response: confirmedCC,
  },
  {
    path: /vaos\/v0\/appointments\?.*type=va.*/,
    response: confirmedVA,
  },
  {
    path: /vaos\/v0\/appointments\/va\/.*/,
    response: url => {
      const segments = url.split(/[/]/);
      const id = segments[segments.length - 1];
      return {
        data: confirmedVA.data.find(appt => appt.id === id),
      };
    },
  },
  {
    path: /vaos\/v0\/appointment_requests\?/,
    response: requests,
  },
  {
    path: /vaos\/v0\/appointment_requests\//,
    response: url => {
      const segments = url.split('/');
      const id = segments[segments.length - 1];
      return {
        data: requests.data.find(req => req.id === id),
      };
    },
  },
  {
    path: /vaos\/v0\/appointment_requests\/.*\/messages/,
    response: url => {
      if (url.includes('8a48912a6c2409b9016c525a4d490190')) {
        return messages0190;
      }

      if (url.includes('8a48912a6cab0202016cb4fcaa8b0038')) {
        return messages0038;
      }

      return { data: [] };
    },
  },
  {
    path: /vaos\/v0\/facilities\?/,
    response: parentFacilities,
  },
  {
    path: /vaos\/v0\/systems\/.*\/direct_scheduling_facilities/,
    response: url => {
      if (url.includes(EXPRESS_CARE)) {
        if (url.includes('systems/983/')) {
          return expressCareFacilities983;
        } else {
          return expressCareFacilities984;
        }
      } else if (url.endsWith('parent_code=984')) {
        return facilities984;
      } else if (url.endsWith('parent_code=983A6')) {
        return facilities983A6;
      } else {
        return facilities983;
      }
    },
  },
  {
    path: /community_care\/eligibility/,
    response: {
      data: {
        id: 'PrimaryCare',
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    },
  },
  {
    path: /community_care\/supported_sites/,
    response: sitesSupportingVAR,
  },
  {
    path: /vaos\/v0\/facilities\/.*\/visits/,
    response: url => {
      if (url.includes('visits/direct')) {
        return {
          data: {
            id: '05084676-77a1-4754-b4e7-3638cb3124e5',
            type: 'facility_visit',
            attributes: {
              durationInMonths: 24,
              hasVisitedInPastMonths: !url.includes('facilities/984'),
            },
          },
        };
      }

      return {
        data: {
          id: '05084676-77a1-4754-b4e7-3638cb3124e5',
          type: 'facility_visit',
          attributes: {
            durationInMonths: 12,
            hasVisitedInPastMonths: !url.includes('facilities/984/'),
          },
        },
      };
    },
  },
  {
    path: /vaos\/v0\/facilities\/(.*)\/limits/,
    response: (url, { groups }) => {
      const facilityId = groups[0];
      return {
        data: {
          id: facilityId,
          attributes: {
            requestLimit: 1,
            numberOfRequests: facilityId.includes('984') ? 1 : 0,
          },
        },
      };
    },
  },
  {
    path: /vaos\/v0\/facilities\/.*\/clinics/,
    response: url => {
      if (url.includes('facilities/983/')) {
        return clinicList983;
      } else if (url.includes('facilities/612')) {
        return clinicList612;
      }

      return {
        data: [],
      };
    },
  },
  {
    path: /v1\/facilities\/va\/vha_/,
    response: url => {
      if (url.endsWith('vha_552')) {
        return facilityDetails984;
      }

      return facilityDetails983;
    },
  },
  {
    path: /v1\/facilities\/va\?ids/,
    response: facilityData,
  },
  {
    path: /v1\/facilities\/ccp/,
    response: ccProviders,
    delay: 5000,
  },
  {
    path: /vaos\/v0\/facilities\/.*\/available_appointments/,
    delay: 2000,
    response: () => {
      return set(
        'data[0].attributes.appointmentTimeSlot',
        generateMockSlots(),
        varSlots,
      );
    },
  },
  {
    path: /vaos\/v0\/facilities\/.*\/cancel_reasons/,
    response: cancelReasons,
  },
  {
    path: /vaos\/v0\/request_eligibility_criteria/,
    response: requestEligibilityCriteria,
  },
  {
    path: /vaos\/v0\/direct_booking_eligibility_criteria/,
    response: directBookingEligibilityCriteria,
  },
  {
    path: /vaos\/v0\/preferences/,
    response: {
      data: { attributes: { emailAllowed: true } },
    },
  },
  {
    method: 'PUT',
    path: /vaos\/v0\/appointments\/cancel/,
    response: null,
  },
  {
    method: 'POST',
    path: /vaos\/v0\/appointment_requests/,
    response: (url, { requestData }) => {
      if (requestData.typeOfCareId === EXPRESS_CARE) {
        return {
          data: {
            id: 'testing',
            attributes: {
              email: requestData.email,
              phoneNumber: requestData.phoneNumber,
              typeOfCareId: requestData.typeOfCareId,
              reasonForVisit: requestData.reasonForVisit,
              additionalInformation: requestData.additionalInformation,
              status: 'Submitted',
            },
          },
        };
      }

      return {
        data: {
          id: 'testing',
          attributes: {},
        },
      };
    },
  },
  {
    method: 'PUT',
    path: /vaos\/v0\/appointment_requests/,
    response: (url, { requestData }) => {
      const requestAttributes = requests.data.find(
        item => item.id === requestData.id,
      ).attributes;

      return {
        data: {
          id: requestData.id,
          attributes: {
            ...requestAttributes,
            status: 'Cancelled',
          },
        },
      };
    },
  },
  {
    method: 'POST',
    path: /vaos\/v0\/appointments$/,
    response: null,
  },
  {
    method: 'POST',
    path: /vaos\/v0\/appointment_requests\/.*\/messages/,
    response: {
      data: { attributes: {} },
    },
  },
  {
    method: 'PUT',
    path: /vaos\/v0\/preferences/,
    response: {
      data: { attributes: {} },
    },
  },
  {
    path: /vaos.*HealthcareService.*Location.identifier=983/,
    response: healthcareService983,
  },
  {
    path: /vaos.*HealthcareService.*Location.identifier=984/,
    response: healthcareService984,
  },
  {
    path: /vaos.*HealthcareService.*Organization.identifier=983/,
    response: locations983,
  },
  {
    path: /vaos.*HealthcareService.*Organization.identifier=984/,
    response: locations984,
  },
  {
    path: /vaos.*\/Organization\?/,
    response: organization,
  },
  {
    path: /vaos.*\/Slot\?/,
    response: () => ({ ...fhirSlots, entry: generateMockFHIRSlots() }),
  },
];
