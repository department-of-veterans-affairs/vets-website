import { apiRequest } from 'platform/utilities/api';
import { getAPI, resolveParamsWithUrl } from '../config';
// import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';

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
    const reduxStore = require('../facility-locator-entry');
    const { params, url } = resolveParamsWithUrl({
      address,
      locationType,
      serviceType,
      page,
      bounds,
      center,
      radius,
      allUrgentCare,
      reduxStore,
    });

    const api = getAPI();
    const startTime = new Date().getTime();
    return apiRequest(`${url}?${params}`, { ...api.settings }).then(res => {
      const endTime = new Date().getTime();
      const resultTime = endTime - startTime;
      return {
        ...res,
        meta: {
          resultTime,
        },
      };
    });
  }

  /**
   * Get one VA Facililty's details.
   *
   * @param {string} id The ID of the Facility
   */
  static fetchVAFacility(id) {
    const api = getAPI();
    const url = `${api.url}/${id}`;

    return apiRequest(url, { ...api.settings });
  }

  /**
   * Get one CC Provider's details.
   *
   * @param {string} id The ID of the CC Provider
   */
  static fetchProviderDetail(id) {
    const api = getAPI();
    const url = `${api.baseUrl}/ccp/${id}`;

    return apiRequest(url, { ...api.settings });
  }

  /**
   * Get all known specialties available from all CC Providers.
   */
  static getProviderSpecialties() {
    const api = getAPI();
    const url = `${api.baseUrl}/ccp/specialties`;

    return apiRequest(url, { ...api.settings }).then(data =>
      data.data.map(speciality => speciality.attributes),
    );
  }
}

export default LocatorApi;
