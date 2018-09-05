/* eslint-disable space-in-parens */
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
  static searchWithBounds(address = null, bounds, locationType, serviceType, page) {
    const filterableLocations = ['health', 'benefits'];
    const params = compact([
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      locationType ? `type=${locationType}` : null,
      filterableLocations.includes(locationType) && serviceType ? `services[]=${serviceType}` : null,
      `page=${page}`
    ]).join('&');

    const url = `${api.url}?${params}`;
    return new Promise( (resolve, reject) => {
      fetch(url, api.settings)
        .then( res => res.json())
        .then(
          data => resolve(data),
          error => reject(error)
        );
    });
  }

  static fetchVAFacility(id) {
    const url = `${api.url}/${id}`;

    return new Promise( (resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        .then(
          data => resolve(data),
          error => reject(error)
        );
    });
  }

  static fetchProviderDetail(id) {
    const url = `${api.baseUrl}/ccp/detail/${id}`;

    return new Promise( (resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        .then(
          data => resolve(data),
          error => reject(error)
        );
    });
  }

  static getProviderSvcs() {
    const url = `${api.baseUrl}/ccp/services`;

    return this.executeFetch(url);
  }

  executeFetch = (url) => {
    return new Promise( (resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json)
        .then(
          data => resolve(data),
          error => reject(error)
        );
    });
  }

}

export default LocatorApi;
