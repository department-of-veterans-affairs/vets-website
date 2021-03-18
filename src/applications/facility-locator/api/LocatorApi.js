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
   * @returns {Promise} Promise object
   */
  static searchWithBounds(
    address = null,
    bounds,
    locationType,
    serviceType,
    page,
    center,
    radius,
    allUrgentCare,
  ) {
    const { params, url } = resolveParamsWithUrl(
      address,
      locationType,
      serviceType,
      page,
      bounds,
      center,
      radius,
      allUrgentCare,
    );

    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      fetch(`${url}?${params}`, api.settings)
        .then(res => res.json())
        .then(res => {
          const endTime = new Date().getTime();
          res.meta.resultTime = endTime - startTime;
          return res;
        })
        .then(data => resolve(data), error => reject(error));
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
   * Get all known specialties available from all CC Providers.
   */
  static getProviderSpecialties() {
    const url = `${api.baseUrl}/ccp/specialties`;
    return new Promise((resolve, reject) => {
      fetch(url, api.settings)
        .then(res => res.json())
        .then(
          data => resolve(data.data.map(specialty => specialty.attributes)),
          error => reject(error),
        );
    });
  }
}

export default LocatorApi;
