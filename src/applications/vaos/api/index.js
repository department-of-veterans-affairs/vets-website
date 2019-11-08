import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';
import slots from './slots.json';

import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

import mockClinicList from './clinicList983.json';
import mockPACT from './pact.json';
import mockCancelReasons from './cancel_reasons.json';
import sitesSupportingVAR from './sites-supporting-var.json';

// This wil go away once we stop mocking api calls
const TEST_TIMEOUT = navigator.userAgent === 'node.js' ? 1 : null;
function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  return facilityId;
}

// GET /vaos/appointments
// eslint-disable-next-line no-unused-vars
export function getConfirmedAppointments(endDate) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(confirmed);
    }, TEST_TIMEOUT || 1500);
  });
}

// GET /vaos/requests
// eslint-disable-next-line no-unused-vars
export function getPendingAppointments(endDate) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pending);
    }, TEST_TIMEOUT || 1500);
  });
}

// This request takes a while, so we're going to call it early
// and we need a way to wait for an in progress call to finish
// So this memoizes the promise and returns it to the caller
//
// GET /vaos/appointments
export const getPastAppointments = (() => {
  let promise = null;
  // eslint-disable-next-line no-unused-vars
  return startDate => {
    if (!promise) {
      promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(past);
        }, TEST_TIMEOUT || 6000);
      });
    }
    return promise;
  };
})();

// GET /vaos/systems
export const getSystemIdentifiers = (() => {
  let promise = null;

  return () => {
    if (promise && navigator.userAgent !== 'node.js') {
      return promise;
    }

    if (environment.isLocalhost()) {
      promise = import('./systems.json')
        .then(module => (module.default ? module.default : module))
        .then(json => json.data.map(item => item.attributes));
    } else {
      promise = fetch(`${environment.API_URL}/v0/vaos/systems`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Key-Inflection': 'camel',
        },
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }

          throw new Error(resp.status);
        })
        .then(json => json.data.map(item => item.attributes));
    }

    return promise;
  };
})();

// GET /vaos/facilities
// eslint-disable-next-line no-unused-vars
export function getSystemDetails(systemIds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFacilityData);
    }, TEST_TIMEOUT || 1000);
  });
}

// GET /vaos/systems/{systemId}/facilities
// eslint-disable-next-line no-unused-vars
export function getFacilitiesBySystemAndTypeOfCare(systemId, typeOfCareId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (systemId === '984') {
        resolve(mockFacility984Data);
      } else {
        resolve(mockFacility983Data);
      }
    }, TEST_TIMEOUT || 1000);
  });
}

export function getCommunityCare() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        isEligible: true,
        reason: 'User is within x miles of facility',
        effectiveDate: '2017-10-08T23:35:12-05:00',
      });
    }, TEST_TIMEOUT || 1500);
  });
}

// GET /vaos/facilities/{facilityId}/visits/{directOrRequest}
// eslint-disable-next-line no-unused-vars
export function checkPastVisits(facilityId, typeOfCareId, directOrRequest) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (directOrRequest === 'direct') {
        resolve({
          durationInMonths: 24,
          hasVisitedInPastMonths: !facilityId.includes('984'),
        });
      } else {
        resolve({
          durationInMonths: 12,
          hasVisitedInPastMonths: facilityId !== '984',
        });
      }
    }, 500);
  });
}

// GET /vaos/facilities/{facilityId}/limits
// eslint-disable-next-line no-unused-vars
export function getRequestLimits(facilityId, typeOfCareId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        requestLimit: 1,
        numberOfRequests: facilityId.includes('984') ? 1 : 0,
      });
    }, 500);
  });
}

// GET /vaos/facilities/{facilityId}/clinics
// Also takes systemId has a query param, which is the first three digits of
// facilityId
// eslint-disable-next-line no-unused-vars
export function getClinics(facilityId, typeOfCareId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (facilityId.includes('983')) {
        resolve(mockClinicList);
      } else {
        resolve([]);
      }
    }, 500);
  });
}

// GET /vaos/systems/{systemId}/pact
// eslint-disable-next-line no-unused-vars
export function getPacTeam(systemId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (systemId === '983') {
        resolve(mockPACT);
      } else {
        resolve([]);
      }
    }, 750);
  });
}

export function getFacilityInfo(facilityId) {
  if (environment.isLocalhost()) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          attributes: {
            name: 'Cheyenne VA Medical Center',
            address: {
              physical: {
                zip: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                address1: '2360 East Pershing Boulevard',
                address2: null,
                address3: null,
              },
            },
          },
        });
      }, TEST_TIMEOUT || 2000);
    });
  }
  return apiRequest(`/facilities/va/vha_${getStagingId(facilityId)}`).then(
    resp => resp.data,
  );
}

export function getSitesSupportingVAR() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sitesSupportingVAR);
    }, TEST_TIMEOUT || 1500);
  });
}

export function getAvailableSlots() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(slots);
    }, 500);
  });
}

// GET /vaos/facilities/{facilityId}/cancel-reasons
// eslint-disable-next-line no-unused-vars
export function getCancelReasons(systemId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockCancelReasons.cancelReasonsList);
    }, 500);
  });
}

// PUT /vaos/appointments
// eslint-disable-next-line no-unused-vars
export function updateAppointment(appt) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

// PUT /vaos/requests
// eslint-disable-next-line no-unused-vars
export function updateRequest(appt) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}
