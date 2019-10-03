// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';

import mockSystems from './systems.json';
import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

import mockClinicList from './clinicList983.json';

export function getConfirmedAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(confirmed);
    }, 1500);
  });
}

export function getPendingAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pending);
    }, 1500);
  });
}

export function getPastAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(past);
    }, 6000);
  });
}

export function getSystemIdentifiers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockSystems);
    }, 600);
  });
}

export function getSystemDetails() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFacilityData);
    }, 1000);
  });
}

export function getFacilitiesBySystemAndTypeOfCare(typeOfCareId, facilityId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (facilityId.includes('984')) {
        resolve(mockFacility984Data);
      } else {
        resolve(mockFacility983Data);
      }
    }, 1000);
  });
}

export function checkPastVisits(facilityId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        durationInMonths: 24,
        hasVisitedInPastMonths: facilityId.includes('984'),
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
