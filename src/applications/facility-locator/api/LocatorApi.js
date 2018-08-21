/* eslint-disable space-in-parens */
import { api } from '../config';

class LocatorApi {

  static searchWithBounds(url) {
    return new Promise( (resolve, reject) => {
      fetch(url, api.settings)
        .then( res => res.json())
        .then(
          data => resolve(data),
          error => reject(error)
        );
    });
  }

  static fetchVAFacility(url) {
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
