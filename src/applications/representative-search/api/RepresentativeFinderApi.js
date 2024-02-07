import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import { getApi, resolveParamsWithUrl } from '../config';

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
    searchArea,
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
      searchArea,
    });

    const endpoint =
      type === 'veteran_service_officer'
        ? '/vso_accredited_representatives'
        : '/other_accredited_representatives';

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

  static reportResult(newReport) {
    const reportRequestBody = {
      representativeId: newReport.representativeId,
      flags: [],
    };

    const startTime = new Date().getTime();

    for (const [flagType, flaggedValue] of Object.entries(newReport.reports)) {
      if (flaggedValue !== null) {
        reportRequestBody.flags.push({
          flagType,
          flaggedValue,
        });
      }
    }

    const { requestUrl, apiSettings } = getApi(
      '/flag_accredited_representatives',
      'POST',
      reportRequestBody,
    );

    return new Promise((resolve, reject) => {
      fetch(requestUrl, apiSettings)
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
