import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import { getAPI, resolveParamsWithUrl } from '../config';
import manifest from '../manifest.json';

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
    const { params, url, postParams } = resolveParamsWithUrl({
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
    return new Promise((resolve, reject) => {
      if (url.slice(-3) === '/va') {
        fetch(`${url}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Key-Inflection': 'camel',
            'Source-App-Name': manifest.entryName,
          },
          method: 'POST',
          body: JSON.stringify(postParams),
        })
          .then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then(res => {
            const endTime = new Date().getTime();
            const resultTime = endTime - startTime;
            res.meta = {
              ...res.meta,
              resultTime,
            };
            return res;
          })
          .then(data => resolve(data), error => reject(error));
      } else {
        fetch(`${url}?${params}`, api.settings)
          .then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then(res => {
            const endTime = new Date().getTime();
            const resultTime = endTime - startTime;
            res.meta = {
              ...res.meta,
              resultTime,
            };
            return res;
          })
          .then(data => resolve(data), error => reject(error));
      }
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
    const api = getAPI();
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
    const api = getAPI();
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
