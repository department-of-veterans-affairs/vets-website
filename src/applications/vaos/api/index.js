// Mock Data
import confirmed from './confirmed.json';
import pending from './requests.json';
import past from './past.json';

import mockSystems from './systems.json';
import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

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

export function getPastAppointments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(past);
    }, TEST_TIMEOUT || 6000);
  });
}

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
