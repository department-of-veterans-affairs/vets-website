/* eslint-disable space-in-parens */
import compact from 'lodash/compact';
import { api } from '../config';

class LocatorApi {

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
}

export default LocatorApi;
