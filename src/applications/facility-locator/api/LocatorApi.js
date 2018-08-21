/* eslint-disable space-in-parens */
import { api } from '../config';

class LocatorApi {

  static searchWithBounds(params) {
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
