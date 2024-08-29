import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

class RepresentativeStatusApi {
  static getRepresentativeStatus() {
    const requestUrl = `${
      environment.API_URL
    }/representation_management/v0/power_of_attorney`;
    const apiSettings = {
      'Content-Type': 'application/json',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
      },
    };
    const startTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      fetch(requestUrl, apiSettings)
        .then(response => {
          if (!response.ok && response.status !== 422) {
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

export default RepresentativeStatusApi;
