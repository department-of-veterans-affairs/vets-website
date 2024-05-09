/** @module testing/mocks/helpers */

import moment from 'moment';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';

/**
 * Mocks appointment-related api calls for the past appointments page
 *
 * @export
 * @param {Object} params
 * @param {Array<MASAppointment>} [params.va=[]] VA appointments to return from mock
 * @param {Array<VARCommunityCareAppointment>} [params.cc=[]] CC appointments to return from mock
 * @param {Array<VARRequest>} [params.requests=[]] Requests to return from mock
 */
export function mockPastAppointmentInfo({ va = [], cc = [], requests = [] }) {
  if (!global.fetch.isSinonProxy) {
    mockFetch();
  }
  const baseUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${moment()
    .startOf('day')
    .add(-3, 'months')
    .toISOString()}&end_date=${moment()
    .set('milliseconds', 0)
    .toISOString()}`;

  const vaUrl = `${baseUrl}&type=va`;
  const ccUrl = `${baseUrl}&type=cc`;

  setFetchJSONResponse(global.fetch.withArgs(vaUrl), { data: va });
  setFetchJSONResponse(global.fetch.withArgs(ccUrl), { data: cc });

  const requestsUrl = `${
    environment.API_URL
  }/vaos/v0/appointment_requests?start_date=${moment()
    .startOf('day')
    .add(-3, 'months')
    .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`;
  setFetchJSONResponse(global.fetch.withArgs(requestsUrl), {
    data: requests,
  });
}

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

/**
 * Returns a mocked requested period object. Should probably not be in here
 *
 * @export
 * @param {MomentDate} date Moment date for the date of the request
 * @param {am|pm} amOrPm Set the requested period to be AM or PM
 * @returns {RequestedPeriod} Requested period object
 */
export function setRequestedPeriod(date, amOrPm) {
  const isAM = amOrPm.toUpperCase() === 'AM';
  return {
    start: `${date.format('YYYY-MM-DD')}T${
      isAM ? '00:00:00.000Z' : `12:00:00.000Z`
    }`,
    end: `${date.format('YYYY-MM-DD')}T${
      isAM ? '11:59:59.999Z' : `23:59:59.999Z`
    }`,
  };
}

/**
 * Mocks the api call to get parent sites from var-resources. Really only used
 * on the old two step facility page.
 *
 * @export
 * @param {Array<string>} ids A list of VistA site ids to mock the request for
 * @param {Array<VARParentSite>} data The list of parent site data returned from the mock call
 */
export function mockParentSites(ids, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/facilities?${ids
        .map(id => `facility_codes[]=${id}`)
        .join('&')}`,
    ),
    { data },
  );
}

/**
 * Mock the api calls that checks if a user is eligible for community care for
 *   a given type of care and if the facility supports CC
 *
 * @export
 * @param {Object} params
 * @param {Array<string>} params.parentSites The VA parent sites to check for CC support
 * @param {Array<string>} params.supportedSites The VA parent sites that support CC
 * @param {string} params.careType Community care type of care string
 * @param {boolean} [eligible=true] Is the user eligible for CC
 */
export function mockCommunityCareEligibility({
  parentSites,
  supportedSites,
  careType,
  eligible = true,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/community_care/supported_sites?${parentSites
        .map(site => `site_codes[]=${site}`)
        .join('&')}`,
    ),
    {
      data: (supportedSites || parentSites).map(parent => ({
        id: parent,
        attributes: {
          name: 'fake',
          timezone: 'fake',
        },
      })),
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/community_care/eligibility/${careType}`,
    ),
    {
      data: {
        id: careType,
        attributes: {
          eligible,
        },
      },
    },
  );
}

/**
 * Mock the browser geolocation api with a given position
 *
 * @export
 * @param {Object} [params]
 * @param {number} [latitude=53.2734] Latitude value (defaulted to San Diego)
 * @param {number} [longitude=-7.77832031] Longitude value (defaulted to San Diego)
 * @param {boolean} [fail=false] Should the geolocation request fail
 */
export function mockGetCurrentPosition({
  latitude = 53.2734, // San Diego, CA
  longitude = -7.77832031,
  fail = false,
} = {}) {
  global.navigator.geolocation = {
    getCurrentPosition: sinon.stub().callsFake(
      (successCallback, failureCallback) =>
        fail
          ? Promise.resolve(
              failureCallback({
                code: 1,
                message: 'User denied Geolocation',
              }),
            )
          : Promise.resolve(
              successCallback({ coords: { latitude, longitude } }),
            ),
    ),
  };
}
