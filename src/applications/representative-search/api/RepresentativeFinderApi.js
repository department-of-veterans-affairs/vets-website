/* eslint-disable camelcase */
import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { getAPI, resolveParamsWithUrl } from '../config';

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
  ) {
    const { params, url } = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
    });

    const api = getAPI(type);
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

  static reportResult(requestBody) {
    const startTime = new Date().getTime();
    const url =
      'https://staging-api.va.gov/services/veteran/v0/services/veteran/v0/flag_accredited_representatives';

    const apiSettings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    return new Promise((resolve, reject) => {
      fetch(url, apiSettings)
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
