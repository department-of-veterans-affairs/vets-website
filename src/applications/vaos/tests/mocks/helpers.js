/** @module testing/mocks/helpers */

import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import {
  getVAAppointmentMock,
  getExpressCareRequestCriteriaMock,
  getRequestEligibilityCriteriaMock,
  getDirectBookingEligibilityCriteriaMock,
  getVAFacilityMock,
} from '../mocks/v0';
import sinon from 'sinon';

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
 * @param {boolean} [params.isHomepageRefresh=false] Set to true if mock for upcoming page on homepage refresh, which
 *   has different date ranges
 */
export function mockAppointmentInfo({
  va = [],
  vaError = false,
  cc = [],
  requests = [],
  partialError = null,
  isHomepageRefresh = false,
}) {
  mockFetch();

  const startDate = isHomepageRefresh
    ? moment().subtract(30, 'days')
    : moment();

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
        .add(isHomepageRefresh ? -120 : -30, 'days')
        .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
    ),
    { data: requests },
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
  mockFetch();
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
 * Mocks appointment-related api calls for the past appointments page when choosing first
 * date range option after default
 *
 * @export
 * @param {Object} params
 * @param {Array<MASAppointment>} [params.va=[]] VA appointments to return from mock
 * @param {Array<VARCommunityCareAppointment>} [params.cc=[]] CC appointments to return from mock
 */
export function mockPastAppointmentInfoOption1({ va = [], cc = [] }) {
  mockFetch();
  setFetchJSONResponse(global.fetch, { data: [] });
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment(
        moment()
          .subtract(5, 'months')
          .startOf('month')
          .format(),
      ).toISOString()}&end_date=${moment(
        moment()
          .subtract(3, 'months')
          .endOf('month')
          .format(),
      ).toISOString()}&type=va`,
    ),
    { data: va },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .add(-5, 'months')
        .startOf('month')
        .format('YYYY-MM-DD')}&end_date=${moment()
        .add(-2, 'months')
        .endOf('month')
        .format('YYYY-MM-DD')}&type=cc`,
    ),
    { data: cc },
  );
}

/**
 * Mocks batch request for facility data from the VA facilities api
 *
 * @export
 * @param {Object} params
 * @param {Array<string>} ids List of facility ids to use in query param
 * @param {Array<VAFacility>} facilities Array of facilities to return from mock
 */
export function mockFacilitiesFetch(ids, facilities) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/v1/facilities/va?ids=${ids}&per_page=${
        ids.split(',').length
      }`,
    ),
    { data: facilities },
  );
}

/**
 * Mocks single facility request for facility data from the VA facilities api
 *
 * @export
 * @param {Object} params
 * @param {string} id Facility id to use in query param
 * @param {VAFacility} facility Facility data to return from mock
 */
export function mockFacilityFetch(id, facility) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va/${id}`),
    { data: facility },
  );
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
        `${environment.API_URL}/v1/facilities/ccp?latitude=${
          address.latitude
        }&longitude=${
          address.longitude
        }&radius=${radius}&per_page=15&page=1&${bboxQuery}&${specialtiesQuery}&type=provider&trim=true`,
      ),
      { errors: [] },
    );
  } else {
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${environment.API_URL}/v1/facilities/ccp?latitude=${
          address.latitude
        }&longitude=${
          address.longitude
        }&radius=${radius}&per_page=15&page=1&${bboxQuery}&${specialtiesQuery}&type=provider&trim=true`,
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
 * Mocks the api call made to cancel a request.
 *
 * @export
 * @param {VARRequest} appointment Request object from var-resources that will be returned back
 *    from the mock with the status set to Cancelled
 */
export function mockRequestCancelFetch(appointment) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests/${appointment.id}`,
    ),
    {
      data: {
        ...appointment,
        attributes: {
          ...appointment.attributes,
          status: 'Cancelled',
        },
      },
    },
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
 * Mocks the api call to check if the given sites allow community care requests
 *
 * @export
 * @param {Array<string>} ids List of VistA parent site ids to check for CC support
 * @param {Array<VARSupportedSite>} data List of community care enabled VA parent site data to return
 *   from mock call
 */
export function mockSupportedCCSites(ids, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/community_care/supported_sites?${ids
        .map(id => `site_codes[]=${id}`)
        .join('&')}`,
    ),
    { data },
  );
}

/**
 * Mock the api call to get supported facilities for a parent site through var-resources.
 * Used on old two step facility page.
 *
 * @export
 * @param {Object} params
 * @param {string} params.siteId The 3 digit VistA site id that the facilities are associated with
 * @param {string} params.parentId The VA parent facility id that the facilities are associated with
 * @param {string} params.typeOfCareId The type of care id the facilities should support
 * @param {Array<VARFacility>} params.data The array of var-resouces facilities to return from the mock
 * }
 */
export function mockSupportedFacilities({
  siteId,
  parentId,
  typeOfCareId,
  data,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/systems/${siteId}/direct_scheduling_facilities?type_of_care_id=${typeOfCareId}&parent_code=${parentId}`,
    ),
    { data },
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
  pastClinics = false,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${facilityId}/limits?type_of_care_id=${typeOfCareId}`,
    ),
    {
      data: {
        attributes: {
          requestLimit: 1,
          numberOfRequests: limit ? 0 : 1,
        },
      },
    },
  );
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

  const pastAppointments = clinics.map(clinic => {
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
 * Mocks the api call that fetches messages for a given request
 *
 * @export
 * @param {string} id The request id to pull messages for
 * @param {Array<VARRequestMessage>} data The list of message objects to return from the mock
 */
export function mockMessagesFetch(id, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests/${id}/messages`,
    ),
    { data },
  );
}

/**
 * Mocks the api call that submits an appointment
 *
 * @export
 * @param {MASAppointment} data The appointment data to return from the mock
 */
export function mockAppointmentSubmit(data) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v0/appointments`),
    { data },
  );
}

/**
 * Mocks the api call that gets the request settings from VATS
 *
 * @export
 * @param {Array<string>} parentSites The VistA site ids to pull settings for
 * @param {Array<VATSRequestCriteria>} data The list of facilities with their settings to return from the mock
 */
export function mockRequestEligibilityCriteria(parentSites, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/request_eligibility_criteria?${parentSites
        .map(site => `parent_sites[]=${site}`)
        .join('&')}`,
    ),
    { data },
  );
}

/**
 * Mocks the api call that gets the direct scheduling settings from VATS
 *
 * @export
 * @param {Array<string>} parentSites The VistA site ids to pull settings for
 * @param {Array<VATSDirectCriteria>} data The list of facilities with their settings to return from the mock
 */
export function mockDirectBookingEligibilityCriteria(siteIds, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/direct_booking_eligibility_criteria?${siteIds
        .map(site => `parent_sites[]=${site}`)
        .join('&')}`,
    ),
    { data },
  );
}

/**
 * Mocks the api calls used on the flat facilities page
 *
 * @export
 * @param {Array<string>} parentSiteIds The VistA site ids to request facilities for
 * @param {Array<string>} facilityIds The VA facility ids of facilities to return from the mocks
 * @param {string} typeOfCareId The type of care id the facilities should support
 * @param {Object} typeOfCare The settings object for the given type of care
 * @returns {Object} An object with the results of the three mock calls
 */
export function mockFacilitiesPageFetches(
  parentSiteIds,
  facilityIds,
  typeOfCareId,
  typeOfCare,
) {
  const requestFacilityAttributes = getRequestEligibilityCriteriaMock()
    .attributes;

  const requestFacilities = facilityIds.map(id => ({
    id,
    attributes: {
      ...requestFacilityAttributes,
      id,
      requestSettings: [
        {
          ...requestFacilityAttributes.requestSettings[0],
          id: typeOfCareId,
          typeOfCare,
        },
      ],
    },
  }));

  const directFacilityAttributes = getDirectBookingEligibilityCriteriaMock()
    .attributes;

  const directFacilities = facilityIds.map(id => ({
    id,
    attributes: {
      ...directFacilityAttributes,
      id,
      coreSettings: [
        {
          ...directFacilityAttributes.coreSettings[0],
          id: typeOfCareId,
          typeOfCare,
        },
      ],
    },
  }));

  const vhaIds = facilityIds.map(
    id => `vha_${id.replace('983', '442').replace('984', '552')}`,
  );

  const facilities = vhaIds.map((id, index) => ({
    id,
    attributes: {
      ...getVAFacilityMock().attributes,
      uniqueId: id.replace('vha_', ''),
      name: `Fake facility name ${index + 1}`,
      address: {
        physical: {
          ...getVAFacilityMock().attributes.address.physical,
          city: `Fake city ${index + 1}`,
        },
      },
    },
  }));

  mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
  mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
  mockFacilitiesFetch(vhaIds.join(','), facilities);

  return { requestFacilities, directFacilities, facilities };
}

/**
 * Mocks the api call used to check if a user is over the request limit for a facility
 * and type of care.
 *
 * @export
 * @param {Object} params
 * @param {string} params.facilityId The id of the facility to check for requests
 * @param {number} [params.requestLimit=1] The request limit to use for the facility
 * @param {number} [params.numberOfRequests=0] The request count to return from the mock. Set this at least equal
 *    to requestLimit to have this check fail
 */
export function mockRequestLimit({
  facilityId,
  requestLimit = 1,
  numberOfRequests = 0,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${facilityId}/limits?type_of_care_id=CR1`,
    ),
    {
      data: {
        id: facilityId,
        attributes: {
          requestLimit,
          numberOfRequests,
        },
      },
    },
  );
}

/**
 * Mocks the api call that sets or retrieves preferences in var-resources
 *
 * @export
 * @param {string} emailAddress The email address to return in the mock
 */
export function mockPreferences(emailAddress) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v0/preferences`),
    {
      data: {
        id: '3071ca1783954ec19170f3c4bdfd0c95',
        type: 'preferences',
        attributes: {
          notificationFrequency: 'Each new message',
          emailAllowed: true,
          emailAddress,
          textMsgAllowed: false,
        },
      },
    },
  );
}

/**
 * Mock the api calls used to set up Express Care windows
 *
 * @export
 * @param {Object} [params]
 * @param {string} [params.facilityId=983] The facility id for the EC window
 * @param {boolean} [params.isWindowOpen=false] Is an EC window open currently for the given facility
 * @param {boolean} [params.isUnderRequestLimit=false] Is this user under the limit for EC requests
 * @param {MomentDate} [params.startTime=null] The start time for the window
 * @param {MomentDate} [params.endTime=null] The end time for the window
 */
export function setupExpressCareMocks({
  facilityId = '983',
  isWindowOpen = false,
  isUnderRequestLimit = false,
  startTime = null,
  endTime = null,
} = {}) {
  const today = moment();
  const start =
    startTime ||
    today
      .clone()
      .subtract(5, 'minutes')
      .tz('America/Denver');
  const end =
    endTime ||
    today
      .clone()
      .add(isWindowOpen ? 3 : -3, 'minutes')
      .tz('America/Denver');
  const requestCriteria = getExpressCareRequestCriteriaMock(facilityId, [
    {
      day: today
        .clone()
        .tz('America/Denver')
        .format('dddd')
        .toUpperCase(),
      canSchedule: true,
      startTime: start.format('HH:mm'),
      endTime: end.format('HH:mm'),
    },
  ]);
  mockRequestEligibilityCriteria([facilityId], [requestCriteria]);
  mockRequestLimit({
    facilityId,
    numberOfRequests: isUnderRequestLimit ? 0 : 1,
  });
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

/**
 * Mocks the fetch request made when retrieving a single CC appointment
 * for the details page
 *
 * @export
 * @param {Object} params
 * @param {VARCommunityCareAppointment} params.appointment CC appointment to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockSingleCommunityCareAppointmentFetch({
  appointment,
  error = null,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${moment()
    .subtract(395, 'days')
    .startOf('day')
    .toISOString()}&end_date=${moment()
    .add(395, 'days')
    .startOf('day')
    .toISOString()}&type=cc`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: [appointment],
    });
  }
}
