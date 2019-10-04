// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';

import mockSystems from './systems.json';
import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

import mockClinicList from './clinicList983.json';

// This wil go away once we stop mocking api calls
const TEST_TIMEOUT = navigator.userAgent === 'node.js' ? 1 : null;

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

export function getFacilitiesBySystemAndTypeOfCare(typeOfCareId, facilityId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (facilityId === '984') {
        resolve(mockFacility984Data);
      } else {
        resolve(mockFacility983Data);
      }
    }, TEST_TIMEOUT || 1000);
  });
}

export function checkPastVisits(facilityId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        durationInMonths: 24,
        hasVisitedInPastMonths: !facilityId.includes('984'),
      });
    }, 500);
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
