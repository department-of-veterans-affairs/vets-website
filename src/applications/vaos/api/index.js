import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';

import mockSystems from './systems.json';
import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

import mockClinicList from './clinicList983.json';
import mockPACT from './pact.json';

// This wil go away once we stop mocking api calls
const TEST_TIMEOUT = navigator.userAgent === 'node.js' ? 1 : null;
function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  return facilityId;
}

export function getConfirmedAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(confirmed);
    }, TEST_TIMEOUT || 1500);
  });
}

export function getPendingAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pending);
    }, TEST_TIMEOUT || 1500);
  });
}

// This request takes a while, so we're going to call it early
// and we need a way to wait for an in progress call to finish
// So this memoizes the promise and returns it to the caller
export const getPastAppointments = (() => {
  let promise = null;
  return () => {
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

export function getSystemIdentifiers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockSystems);
    }, TEST_TIMEOUT || 600);
  });
}

export function getSystemDetails() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFacilityData);
    }, TEST_TIMEOUT || 1000);
  });
}

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

export function getRequestLimits(facilityId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        requestLimit: 1,
        numberOfRequests: facilityId.includes('984') ? 1 : 0,
      });
    }, 500);
  });
}

export function getClinics(facilityId) {
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

export function getFacilityInfo(facilityId) {
  if (environment.isLocalhost()) {
    return Promise.resolve({
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
  }
  return apiRequest(`/facilities/va/vha_${getStagingId(facilityId)}`).then(
    resp => resp.data,
  );
}
