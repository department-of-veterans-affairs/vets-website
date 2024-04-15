/** @module testing/mocks/fetch */
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { mockEligibilityFetches } from './helpers';
import { getV2ClinicMock, getVAOSAppointmentMock } from './v2';
import { TYPES_OF_CARE } from '../../utils/constants';
import { getDateRanges, mockVAOSAppointmentsFetch } from './helpers.v2';

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
 * @param {Array<VARClinic|VAOSClinic>} [params.clinics=[]] The clinics returned during the eligibility checks
 * @param {boolean} [params.pastClinics=false] Whether or not the mock should also mock an appointments fetch with an
 *    past appointment with a clinic matching one passed in the clinics param, so that the user passes the past clinics check
 * @param {number} [version=2] The version of the calls to set up, defaulted to version 2
 * }
 */
export function mockEligibilityFetchesByVersion({
  facilityId,
  typeOfCareId,
  limit = false,
  requestPastVisits = false,
  directPastVisits = false,
  clinics = [],
  pastClinics = false,
  version = 2,
}) {
  if (version === 2) {
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

    const pastAppointments = clinics.map(clinic => {
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
  } else if (version === 0) {
    mockEligibilityFetches({
      siteId: facilityId.substr(0, 3),
      facilityId,
      typeOfCareId: TYPES_OF_CARE.find(t => t.idV2 === typeOfCareId).id,
      limit,
      requestPastVisits,
      directPastVisits,
      clinics,
      pastClinics,
    });
  }
}

/**
 * Fetches a single clinic with the given values
 *
 * @export
 * @param {Object} params
 * @param {string} params.locationId The full location id (sta6aid) of the clinic,
 * @param {string} params.clinicId The id of the clinic to return,
 * @param {string} params.clinicName The name of the clinic to return,
 * @param {number} [params.version=2] Version of the api to use, only 2 is supported,
 *   version = 2,
 * }
 */
export function mockSingleClinicFetchByVersion({
  locationId,
  clinicId,
  clinicName,
  version = 2,
}) {
  if (version === 2) {
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
  } else {
    throw new Error('This should only be used with v2 endpoints');
  }
}

/**
 * Mocks the facilities fetch call using the api for the specified
 * vaos version
 *
 * @export
 * @param {Object} params
 * @param {?Array<string>} params.ids An array of facility ids to use in the query params. Not necessary
 *   unless you are using the children param to return the child facilities of parents
 * @param {Array<MFSFacility|VAFacility>} [params.facilities=[]] An array of facility objects to return from the fetch
 * @param {Boolean} [params.children=false] Sets the children query param, which is meant to include child
 *   facilities. Only relevant for version 2
 * @param {0|2} [params.version=2] The api version to use, defaulted to version 2,
 */
export function mockFacilitiesFetchByVersion({
  ids = null,
  facilities = [],
  children = false,
  version = 2,
} = {}) {
  const idList = ids || facilities.map(f => f.id);

  if (version !== 2) {
    setFetchJSONResponse(
      global.fetch.withArgs(
        sinon.match(
          `/v1/facilities/va?ids=${idList
            // We map test ids to real facility ids when using the VA.gov facility
            // endpoint, but not for the MFSv2 ones, because MFSv2 has test data loaded
            .map(id => id.replace('983', '442').replace('984', '552'))
            .join(',')}`,
        ),
      ),
      { data: facilities },
    );
  } else {
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
}

/**
 * Mocks the single facility fetch call using the api for the specified
 * vaos version
 *
 * @export
 * @param {Object} params
 * @param {MFSFacility|VAFacility} params.facility The facility object to return from the fetch
 * @param {0|2} [params.version=2] The api version to use, defaulted to version 2,
 */
export function mockFacilityFetchByVersion({ facility, version = 2 } = {}) {
  let baseUrl = '';

  if (version !== 2) {
    setFetchJSONResponse(
      global.fetch.withArgs(sinon.match(`/v1/facilities/va/${facility.id}`)),
      { data: facility },
    );
  } else {
    baseUrl = `${environment.API_URL}/vaos/v2/facilities/${facility.id}`;

    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: facility });
  }

  return baseUrl;
}
