/** @module testing/mocks/fetch */
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { getParentSiteMock, getVAAppointmentMock } from './v0';
import {
  mockCommunityCareEligibility,
  mockEligibilityFetches,
  mockParentSites,
} from './helpers';
import { getV2ClinicMock, getV2FacilityMock } from './v2';
import { TYPES_OF_CARE } from '../../utils/constants';
import { createTestStore, setTypeOfCare, setTypeOfFacility } from './setup';
import {
  mockV2CommunityCareEligibility,
  mockVAOSParentSites,
} from './helpers.v2';

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
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v2/patient?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=direct`,
      ),
      {
        data: {
          attributes: {
            hasRequiredAppointmentHistory:
              directPastVisits || typeOfCareId === 'primaryCare',
            isEligibleForNewAppointmentRequest: limit,
          },
        },
      },
    );
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v2/patient?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=request`,
      ),
      {
        data: {
          attributes: {
            hasRequiredAppointmentHistory:
              requestPastVisits || typeOfCareId === 'primaryCare',
            isEligibleForNewAppointmentRequest: limit,
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
      const appointment = getVAAppointmentMock();
      appointment.attributes = {
        ...appointment.attributes,
        startDate: moment().format(),
        facilityId: facilityId.substr(0, 3),
        sta6aid: facilityId,
        clinicId: clinic.id,
      };
      appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';

      return appointment;
    });
    // These will probably need to in the different version blocks after we refactor
    // how the past appointment check works
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

export async function mockCommunityCareFlow({
  toggles = {},
  registeredSites,
  parentSites,
  supportedSites,
  typeOfCareId = 'primaryCare',
}) {
  const typeOfCare = TYPES_OF_CARE.find(care => care.idV2 === typeOfCareId);
  const useV2 = toggles.vaOnlineSchedulingFacilitiesServiceV2;
  const store = createTestStore({
    featureToggles: {
      vaOnlineSchedulingCommunityCare: true,
      ...toggles,
    },
    user: {
      profile: {
        facilities: registeredSites.map(id => ({
          facilityId: id,
          isCerner: false,
        })),
      },
    },
  });
  if (useV2) {
    mockVAOSParentSites(
      registeredSites,
      parentSites.map(data => getV2FacilityMock({ ...data, isParent: true })),
      true,
    );
    mockV2CommunityCareEligibility({
      parentSites: parentSites.map(data => data.id),
      supportedSites,
      careType: typeOfCare.cceType,
    });
  } else {
    mockParentSites(
      registeredSites,
      parentSites.map(data =>
        getParentSiteMock({
          ...data,
          city: data.address?.city,
          state: data.address?.state,
        }),
      ),
    );
    mockCommunityCareEligibility({
      parentSites: parentSites.map(data => data.id),
      supportedSites,
      careType: typeOfCare.cceType,
    });
  }
  await setTypeOfCare(store, new RegExp(typeOfCare.name));
  await setTypeOfFacility(store, /Community Care/i);

  return store;
}
