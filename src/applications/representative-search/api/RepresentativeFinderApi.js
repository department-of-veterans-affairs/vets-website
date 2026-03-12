/* eslint-disable camelcase */

import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { getApi, resolveParamsWithUrl, getEndpointOptions } from '../config';

class RepresentativeFinderApi {
  /**
   * @returns {Promise} Promise object
   */
  static searchByCoordinates(
    address = null,
    lat,
    long,
    name,
    page,
    perPage,
    sort,
    type,
    distance,
  ) {
    const params = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
      distance,
    });

    const { fetchVSOReps, fetchOtherReps } = getEndpointOptions();
    const endpoint =
      type === 'veteran_service_officer' ? fetchVSOReps : fetchOtherReps;

    const { requestUrl, apiSettings } = getApi(endpoint);
    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      fetch(`${requestUrl}${params}`, apiSettings)
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

export default RepresentativeFinderApi;
