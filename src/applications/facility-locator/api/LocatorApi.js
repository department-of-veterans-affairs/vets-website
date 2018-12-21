/* eslint-disable no-use-before-declare */
import compact from 'lodash/compact';
import { api } from '../config';

class LocatorApi {
  /**
   * Sends the request to vets-api to query which locations exist within the
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
  // eslint-disable-next-line prettier/prettier
  static searchWithBounds(address = null, bounds, locationType, serviceType, page) {
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

    const url = `${api.url}?${params}`;
    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        /* eslint-disable prettier/prettier */
        .then(
          data => resolve(data),
          error => reject(error)
        );
        /* eslint-enable prettier/prettier */
    });
  }

  /**
   * Get one VA Facililty's details.
   *
   * @param {string} id The ID of the Facility
   */
  static fetchVAFacility(id) {
    const url = `${api.url}/${id}`;

    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        /* eslint-disable prettier/prettier */
        .then(
          data => resolve(data),
          error => reject(error)
        );
        /* eslint-enable prettier/prettier */
    });
  }

  /**
   * Get one CC Provider's details.
   *
   * @param {string} id The ID of the CC Provider
   */
  static fetchProviderDetail(id) {
    const url = `${api.baseUrl}/ccp/${id}`;

    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        /* eslint-disable prettier/prettier */
        .then(
          data => resolve(data),
          error => reject(error)
        );
        /* eslint-enable prettier/prettier */
    });
  }

  /**
   * Get all known services available from all CC Providers.
   */
  static getProviderSvcs() {
    const url = `${api.baseUrl}/services`;

    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        /* eslint-disable prettier/prettier */
        .then(
          data => resolve(data),
          error => reject(error)
        );
        /* eslint-enable prettier/prettier */
    });
  }
}

export default LocatorApi;
