/** @module testing/mocks/helpers */

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

/**
 * Mocks request to VA community care providers api, used in community care request flow
 *
 * @export
 * @param {Object} address Facility address object with latitude and longitude properties
 * @param {Array<string>} specialties Array of specialty codes used for a type of care
 * @param {Array<string>} bbox Array of bounding box coordinates to search in
 * @param {Array<PPMSProvider>} providers Array of providers to return from mock
 * @param {boolean} [vaError=false] If true mock will return an error response
 * @param {number} [radius=60] Miles radius to search within for the mock, used in query param
 */
export function mockCCProviderFetch(
  address,
  specialties,
  bbox,
  providers,
  vaError = false,
  radius = 60,
) {
  const bboxQuery = bbox.map(c => `bbox[]=${c}`).join('&');
  const specialtiesQuery = specialties.map(s => `specialties[]=${s}`).join('&');

  if (vaError) {
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/facilities_api/v1/ccp/provider?latitude=${
          address.latitude
        }&longitude=${
          address.longitude
        }&radius=${radius}&per_page=15&page=1&${bboxQuery}&${specialtiesQuery}&trim=true`,
      ),
      { errors: [] },
    );
  } else {
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${environment.API_URL}/facilities_api/v1/ccp/provider?latitude=${
          address.latitude
        }&longitude=${
          address.longitude
        }&radius=${radius}&per_page=15&page=1&${bboxQuery}&${specialtiesQuery}&trim=true`,
      ),
      { data: providers },
    );
  }
}
