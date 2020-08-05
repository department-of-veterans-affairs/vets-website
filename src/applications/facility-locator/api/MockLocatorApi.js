// This file mocks a web API by working with the hard-coded data at the bottom.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
import compact from 'lodash/compact';
import { LocationType } from '../constants';
import { facilityData } from '../constants/mock-facilities-data';
import providerServices from '../constants/mock-provider-services.json';
import facilityDataJson from '../constants/mock-facility-data.json';

// Immitate network delay
const delay = 0;

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
    const data = facilityData(locationType, serviceType);
    const filterableLocations = ['health', 'benefits', 'cc_provider'];
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

          const locations = { ...data };

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

  static getProviderSvcs(shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!shouldFail) {
          resolve(providerServices);
        } else {
          reject('Fail condition set, likely for testing reasons.');
        }
      }, delay);
    });
  }
}

export default MockLocatorApi;
