/** @module testing/mocks/helpers */

import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';
import { getVAAppointmentMock } from './v0';

/**
 * Mocks appointment-related api calls for the upcoming appointments page
 *
 * @export
 * @param {Object} params
 * @param {Array<MASAppointment>} [params.va=[]] VA appointments to return from mock
 * @param {boolean} [params.vaError=false] Set to true if mock should return an error
 * @param {boolean} [params.partialError=false] Set to true if mock should return a MAS partial error
 * @param {Array<VARCommunityCareAppointment>} [params.cc=[]] CC appointments to return from mock
 * @param {Array<VARRequest>} [params.requests=[]] Requests to return from mock
 */
export function mockAppointmentInfo({
  va = [],
  vaError = false,
  cc = [],
  requests = [],
  partialError = null,
}) {
  if (!global.fetch.isSinonProxy) {
    mockFetch();
  }

  const startDate = moment().subtract(30, 'days');

  const baseUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${startDate
    .startOf('day')
    .toISOString()}&end_date=${moment()
    .add(395, 'days')
    .startOf('day')
    .toISOString()}`;

  const vaUrl = `${baseUrl}&type=va`;
  const ccUrl = `${baseUrl}&type=cc`;

  if (vaError) {
    setFetchJSONFailure(global.fetch.withArgs(vaUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(vaUrl), {
      data: va,
      meta: {
        errors: partialError ? [partialError] : [],
      },
    });
  }

  setFetchJSONResponse(global.fetch.withArgs(ccUrl), { data: cc });

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?start_date=${moment()
        .add(-120, 'days')
        .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
    ),
    { data: requests },
  );

  // These are common requests made from appointment list tests that happen
  // when we don't care about the results from them
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/request_eligibility_criteria?`,
    ),
    {
      data: [],
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/direct_booking_eligibility_criteria?`,
    ),
    {
      data: [],
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/v1/facilities/va?ids=vha_fake&per_page=1`,
    ),
    {
      data: [],
    },
  );
}

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
 * Mocks api calls used when cancelling an appointment
 *
 * @export
 * @param {string} id Facility id wheren appointment is being cancelled
 * @param {Array<VACancelReason>} reasons Array of cancel reasons to return from mock
 */
export function mockVACancelFetches(id, reasons) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/facilities/${id}/cancel_reasons`,
    ),
    { data: reasons },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v0/appointments/cancel`),
    { data: {} },
  );
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
 * Mocks the api call used to check if a user is over the request limit for a facility
 * and type of care.
 *
 * @export
 * @param {Object} params
 * @param {array} params.facilityIds The list of facility ids to check for requests
 * @param {string} [params.typeOfCareId='CR1'] The type of care id to check
 * @param {number} [params.requestLimit=1] The request limit to use for the facility
 * @param {number} [params.numberOfRequests=0] The request count to return from the mock. Set this at least equal
 *    to requestLimit to have this check fail
 */
export function mockRequestLimits({
  facilityIds,
  typeOfCareId = 'CR1',
  requestLimit = 1,
  numberOfRequests = 0,
}) {
  const data = facilityIds.map(id => ({
    id,
    attributes: {
      numberOfRequests,
      requestLimit,
      institutionCode: id,
    },
  }));

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/limits?type_of_care_id=${typeOfCareId}&${facilityIds
        .map(id => `facility_ids[]=${id}`)
        .join('&')}`,
    ),
    {
      data,
    },
  );
}

/**
 * Mocks the api calls for the various eligibility related fetches VAOS does in the new appointment flow
 *
 * @export
 * @param {Object} params
 * @param {string} params.siteId The VistA site id the facility is associated with
 * @param {string} params.facilityId The VA facility id to check for eligibility at
 * @param {string} params.typeOfCareId The type of care id to check for eligibility for
 * @param {boolean} [params.limit=false] Whether the mock should set the user as passing the request limit check
 * @param {boolean} [params.requestPastVisits=false] Whether the mock should set the user as passing the past visits check
 *    for requests
 * @param {boolean} [params.directPastVisits=false] Whether the mock should set the user as passing the past visits check
 *    for direct scheduling
 * @param {Array<VARClinic>} [params.clinics=[]] The clinics returned during the eligibility checks
 * @param {boolean} [params.pastClinics=false] Whether or not the mock should also mock an appointments fetch with an
 *    past appointment with a clinic matching one passed in the clinics param, so that the user passes the past clinics check
 * }
 */
export function mockEligibilityFetches({
  siteId,
  facilityId,
  typeOfCareId,
  limit = false,
  requestPastVisits = false,
  directPastVisits = false,
  clinics = [],
  matchingClinics = null,
  pastClinics = false,
}) {
  mockRequestLimits({
    facilityIds: [facilityId],
    typeOfCareId,
    requestLimit: 1,
    numberOfRequests: limit ? 0 : 1,
  });

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${facilityId}/visits/direct?system_id=${siteId}&type_of_care_id=${typeOfCareId}`,
    ),
    {
      data: {
        attributes: {
          durationInMonths: 12,
          hasVisitedInPastMonths: directPastVisits,
        },
      },
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${facilityId}/visits/request?system_id=${siteId}&type_of_care_id=${typeOfCareId}`,
    ),
    {
      data: {
        attributes: {
          durationInMonths: 12,
          hasVisitedInPastMonths: requestPastVisits,
        },
      },
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${siteId}`,
    ),
    {
      data: clinics,
    },
  );

  const pastAppointments = (matchingClinics || clinics).map(clinic => {
    const appointment = getVAAppointmentMock();
    appointment.attributes = {
      ...appointment.attributes,
      startDate: moment().format(),
      facilityId: siteId,
      sta6aid: facilityId,
      clinicId: clinic.id,
    };
    appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

    return appointment;
  });

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(12, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .toISOString()}&type=va`,
    ),
    { data: pastClinics ? pastAppointments : [] },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(24, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .subtract(12, 'months')
        .toISOString()}&type=va`,
    ),
    { data: [] },
  );
}

/**
 * Mocks the api call that fetches a list of appointment slots for direct scheduling
 *
 * @export
 * @param {Object} params
 * @param {string} siteId The VistA site id where slots are from
 * @param {string} typeOfCareId The type of care id of the slots being requested
 * @param {string} preferredDate The preferred date chosen by the user, which determines the date range fetched,
 *    if startDate and endDate are not provided
 * @param {MomentDate} startDate The start date for the apppointment slots
 * @param {MomentDate} endDate The end date for the apppointment slots
 * @param {string} [length=20] The length of the appointment slots
 * @param {string} clinicId The VistA clinic id the slots are in
 * @param {Array<VARSlot>} slots The list of slots to return from the mock
 */
export function mockAppointmentSlotFetch({
  siteId,
  typeOfCareId,
  preferredDate,
  startDate,
  endDate,
  length = '20',
  clinicId,
  slots,
}) {
  const start = startDate || preferredDate.clone().startOf('month');
  const end =
    endDate ||
    preferredDate
      .clone()
      .add(1, 'month')
      .endOf('month');

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${siteId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}` +
        `&start_date=${start.format('YYYY-MM-DD')}` +
        `&end_date=${end.format('YYYY-MM-DD')}`,
    ),
    {
      data: [
        {
          id: clinicId,
          type: 'availability',
          attributes: {
            clinicId,
            clinicName: 'Fake',
            appointmentLength: length,
            clinicDisplayStartTime: '9',
            displayIncrements: '3',
            stopCode: 'fake',
            askForCheckIn: false,
            maxOverbooksPerDay: 3,
            hasUserAccessToClinic: true,
            primaryStopCode: 'fake',
            secondaryStopCode: '',
            listSize: slots.length,
            empty: slots.length === 0,
            appointmentTimeSlot: slots,
          },
        },
      ],
    },
  );
}

/**
 * Mocks the api call that submits an appointment request
 *
 * @export
 * @param {'cc'|'va'} type The type of request being made, VA or community care
 * @param {VARRequest} data The request data to return from the mock
 */
export function mockRequestSubmit(type, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?type=${type}`,
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

/**
 * Mocks the fetch request made when retrieving a single request
 * for the details page
 *
 * @export
 * @param {Object} params
 * @param {VARRequest} params.appointment Request to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockSingleRequestFetch({ request, error = null }) {
  const baseUrl = `${environment.API_URL}/vaos/v0/appointment_requests/${
    request.id
  }`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: request });
  }
}

/**
 * Mocks the fetch request made when retrieving a single VA appointment
 * for the details page
 *
 * @export
 * @param {Object} params
 * @param {MASAppointment} params.appointment VA appointment to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockSingleAppointmentFetch({ appointment, error = null }) {
  const baseUrl = `${environment.API_URL}/vaos/v0/appointments/va/${
    appointment.id
  }`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: appointment });
  }
}
