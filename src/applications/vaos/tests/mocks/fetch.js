/** @module testing/mocks/fetch */
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { getV2ClinicMock, getVAOSAppointmentMock } from './mock';
import { getDateRanges, mockVAOSAppointmentsFetch } from './helpers';

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
 * @param {Array<VAOSClinic>} [params.clinics=[]] The clinics returned during the eligibility checks
 * @param {boolean} [params.pastClinics=false] Whether or not the mock should also mock an appointments fetch with an
 *    past appointment with a clinic matching one passed in the clinics param, so that the user passes the past clinics check
 * }
 */
export function mockEligibilityFetches({
  facilityId,
  typeOfCareId,
  limit = false,
  requestPastVisits = false,
  directPastVisits = false,
  matchingClinics = null,
  clinics = [],
  pastClinics = false,
}) {
  const directReasons = [];
  const requestReasons = [];

  if (!directPastVisits && typeOfCareId !== 'primaryCare') {
    directReasons.push({
      coding: [
        {
          code: 'patient-history-insufficient',
        },
      ],
    });
  }

  if (!requestPastVisits && typeOfCareId !== 'primaryCare') {
    requestReasons.push({
      coding: [
        {
          code: 'patient-history-insufficient',
        },
      ],
    });
  }

  if (!limit) {
    requestReasons.push({
      coding: [
        {
          code: 'facility-request-limit-exceeded',
        },
      ],
    });
  }

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=direct`,
    ),
    {
      data: {
        attributes: {
          eligible: directReasons.length === 0,
          ineligibilityReasons:
            directReasons.length === 0 ? undefined : directReasons,
        },
      },
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=request`,
    ),
    {
      data: {
        attributes: {
          eligible: requestReasons.length === 0,
          ineligibilityReasons:
            requestReasons.length === 0 ? undefined : requestReasons,
        },
      },
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/locations/${facilityId}/clinics?clinical_service=${typeOfCareId}`,
    ),
    {
      data: clinics,
    },
  );

  const pastAppointments = (matchingClinics || clinics).map(clinic => {
    const appt = getVAOSAppointmentMock();
    return {
      ...appt,
      attributes: {
        ...appt.attributes,
        clinic: clinic.id,
        locationId: facilityId.substr(0, 3),
      },
    };
  });

  const dateRanges = getDateRanges(3);
  dateRanges.forEach(range => {
    mockVAOSAppointmentsFetch({
      start: range.start,
      end: range.end,
      requests: pastClinics ? pastAppointments : [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });
  });
}

/**
 * Fetches a single clinic with the given values
 *
 * @export
 * @param {Object} params
 * @param {string} params.locationId The full location id (sta6aid) of the clinic,
 * @param {string} params.clinicId The id of the clinic to return,
 * @param {string} params.clinicName The name of the clinic to return,
 * }
 */
export function mockSingleClinicFetch({ locationId, clinicId, clinicName }) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/locations/${locationId}/clinics?clinic_ids%5B%5D=${clinicId}`,
    ),
    {
      data: [
        getV2ClinicMock({
          id: clinicId,
          serviceName: clinicName,
          stationId: locationId,
        }),
      ],
    },
  );
}

/**
 * Mocks the facilities fetch call using the api
 *
 * @export
 * @param {Object} params
 * @param {?Array<string>} params.ids An array of facility ids to use in the query params. Not necessary
 *   unless you are using the children param to return the child facilities of parents
 * @param {Array<VAFacility>} [params.facilities=[]] An array of facility objects to return from the fetch
 * @param {Boolean} [params.children=false] Sets the children query param, which is meant to include child
 *   facilities.
 */
export function mockFacilitiesFetch({
  ids = null,
  facilities = [],
  children = false,
} = {}) {
  const idList = ids || facilities.map(f => f.id);

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/facilities?children=${children}&${idList
        .map(id => `ids[]=${id}`)
        .join('&')}`,
    ),
    { data: facilities },
  );
}

/**
 * Mocks the single facility fetch call using the api
 *
 * @export
 * @param {Object} params
 * @param {VAFacility} params.facility The facility object to return from the fetch
 */
export function mockFacilityFetch({ facility } = {}) {
  const baseUrl = `${environment.API_URL}/vaos/v2/facilities/${facility.id}`;

  setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: facility });

  return baseUrl;
}
