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
}

export default RepresentativeFinderApi;
