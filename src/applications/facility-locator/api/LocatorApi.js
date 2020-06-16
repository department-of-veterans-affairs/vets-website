import { api, resolveParamsWithUrl } from '../config';
import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';

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
   * @param {number} api version number
   * @returns {Promise} Promise object
   */
  static searchWithBounds(
    address = null,
    bounds,
    locationType,
    serviceType,
    page,
    apiVersion,
  ) {
    const { params, url } = resolveParamsWithUrl(
      address,
      locationType,
      serviceType,
      page,
      bounds,
      apiVersion,
    );

    return new Promise((resolve, reject) => {
      fetch(`${url}?${params}`, api.settings)
        .then(res => res.json())
        .then(data => resolve(data), error => reject(error));
    });
  }

  /**
   * Get one VA Facililty's details.
   *
   * @param {string} id The ID of the Facility
   * @param {number} api version number
   */
  static fetchVAFacility(id, apiVersion) {
    const apiUrl = apiVersion === 1 ? api.url : api.urlV0;
    const url = `${apiUrl}/${id}`;

    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        .then(data => resolve(data), error => reject(error));
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
        .then(data => resolve(data), error => reject(error));
    });
  }

  /**
   * Get all known services available from all CC Providers.
   */
  static getProviderSvcs() {
    const url = `${api.baseUrlV0}/services`;
    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        .then(data => resolve(data), error => reject(error));
    });
  }
}

export default LocatorApi;
