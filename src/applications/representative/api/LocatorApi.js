import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import { getAPI, resolveParamsWithUrl } from '../config';

class LocatorApi {
  /**
   * Sends the request to vets-api to query which locations exist within the
   * given bounding box's area and optionally cenetered on the given address.
   *
   * Allows for filtering on representative type.
   *
   * @param {string=} address The address associated with the bounding box's center
   * @param {number[]} bounds Array defining the bounding box of the search area
   * @param {string} representativeType What kind of location? (i.e. facilityType or Provider)
   * @param {number} page Which page of results to start with?
   * @returns {Promise} Promise object
   */
  static searchWithBounds(
    address = null,
    bounds,
    representativeType,
    page,
    center,
    radius,
  ) {
    const reduxStore = require('../app-entry');
    const { params, url } = resolveParamsWithUrl({
      address,
      representativeType,
      page,
      bounds,
      center,
      radius,
      reduxStore,
    });

    const api = getAPI();
    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
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
    });
  }
}

export default LocatorApi;
