// This file mocks a web API by working with the hard-coded data at the bottom.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
import compact from 'lodash/compact';
import providerServices from '../constants/mock-provider-services.json';
import facilityDataJson from '../constants/mock-facility-data.json';
import providersDataJson from '../constants/mock-facility-data-v1.json';
import urgentCareData from '../constants/mock-urgent-care-mashup-data.json';
import emergencyCareData from '../constants/mock-emergency-care-mashup-data.json';

import { urgentCareServices, emergencyCareServices } from '../config';
import {
  CLINIC_URGENTCARE_SERVICE,
  Covid19Vaccine,
  DENTAL_OROFACIAL_PAIN_SERVICE,
} from '../constants';

// Immitate network delay
const delay = 500;

// Map facility type to attribute type
const testVAFacilityTypes = {
  health: 'va_health_facility',
  cemetery: 'va_cemetery',
  benefits: 'va_benefits_facility',
  // eslint-disable-next-line camelcase
  vet_center: 'vet_center',
};

const facilityResultType = 'facility';

const pharmacyType = 'pharmacy';

const ccProviderType = 'provider';

const urgentCareType = 'urgent_care';

const emergencyCareType = 'emergency_care';

function sliceMockData(locationType, serviceType) {
  let locationsData;
  const locations = { ...facilityDataJson };
  // Urgent Care
  if (locationType === urgentCareType) {
    if (!serviceType || serviceType === Object.keys(urgentCareServices)[0]) {
      locationsData = urgentCareData.data;
    }
    if (serviceType === Object.keys(urgentCareServices)[1]) {
      locationsData = urgentCareData.data.filter(
        loc => loc.type === facilityResultType,
      );
    }
    if (serviceType === Object.keys(urgentCareServices)[2]) {
      locationsData = urgentCareData.data.filter(
        loc => loc.type === ccProviderType,
      );
    }
    // Cpp
  } else if (locationType === ccProviderType) {
    if (serviceType === CLINIC_URGENTCARE_SERVICE) {
      locationsData = [providersDataJson.data[12]];
    } else if (serviceType === DENTAL_OROFACIAL_PAIN_SERVICE) {
      locationsData = [providersDataJson.data[10]];
    } else {
      locationsData = [];
    }
    // Pharmacy
  } else if (locationType === pharmacyType) {
    locationsData = [providersDataJson.data[11]];
    // Emergency care
  } else if (locationType === emergencyCareType) {
    if (!serviceType || serviceType === Object.keys(emergencyCareServices)[0]) {
      locationsData = emergencyCareData.data;
    }
    if (serviceType === Object.keys(emergencyCareServices)[1]) {
      locationsData = emergencyCareData.data.slice(0, 3);
    }
    if (serviceType === Object.keys(emergencyCareServices)[2]) {
      locationsData = [emergencyCareData.data[4]];
    }
    // VA types
  } else {
    locationsData = locations.data.filter(
      loc => loc.attributes.facilityType === testVAFacilityTypes[locationType],
    );
  }

  if (locationType === 'health' && serviceType === Covid19Vaccine) {
    locationsData = [providersDataJson.data[1]];
  }

  locations.data = locationsData;
  locations.meta = { resultTime: 100 };

  return locations;
}

class MockLocatorApi {
  /**
   * Sends the fetch request to vets-api to query which locations exist within the
   * given bounding box's area and optionally cenetered on the given address.
   *
   * Allows for filtering on location types and services provided.
   *
   * @param {string=} address The address associated with the bounding box's center
   * @param {number[]} bounds Array defining the bounding box of the search area
   * @param {string} locationType What kind of location? (i.e. facilityType or Provider)
   * @param {string} serviceType What services should the location provide?
   * @param {number} page Which page of results to start with?
   * @returns {Promise} Promise object
   */
  static searchWithBounds(
    address = null,
    bounds,
    locationType,
    serviceType,
    page,
  ) {
    const filterableLocations = ['health', 'benefits', 'provider'];
    const params = compact([
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      locationType ? `type=${locationType}` : null,
      filterableLocations.includes(locationType) && serviceType
        ? `services[]=${serviceType}`
        : null,
      `page=${page}`,
    ]).join('&');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (params && params !== '') {
          if (params.fail) {
            reject('Random failure due to fail flag being set');
          }
          const locations = sliceMockData(locationType, serviceType);
          resolve(locations);
        } else {
          reject('Invalid URL or query sent to API!');
        }
      }, delay);
    });
  }

  static fetchVAFacility(id) {
    const dataFacility = facilityDataJson;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id && (typeof id === 'number' || typeof id === 'string')) {
          const location = dataFacility.data.filter(data => data.id === id);
          if (location && location.length > 0) {
            resolve({ data: location[0] });
          } else {
            reject(`Facility with given ID '${id}' not found!`);
          }
        } else {
          reject('No facility ID or invalid ID specified!');
        }
      }, delay);
    });
  }

  static fetchProviderDetail(id) {
    const dataFacility = facilityDataJson;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id && typeof id === 'string') {
          const location = dataFacility.data.filter(data => data.id === id);
          if (location && location.length > 0) {
            resolve({ data: location[0] });
          } else {
            reject(`Facility with given ID '${id}' not found!`);
          }
        } else {
          reject('No facility ID or invalid ID specified!');
        }
      }, delay);
    });
  }

  static getProviderSpecialties(shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!shouldFail) {
          resolve(providerServices.map(specialty => specialty.attributes));
        } else {
          reject('Fail condition set, likely for testing reasons.');
        }
      }, delay);
    });
  }
}

export default MockLocatorApi;
