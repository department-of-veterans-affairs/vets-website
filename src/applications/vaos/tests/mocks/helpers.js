import moment from 'moment';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import { getVAAppointmentMock } from '../mocks/v0';

export function mockAppointmentInfo({ va = [], cc = [], requests = [] }) {
  mockFetch();
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .toISOString()}&end_date=${moment()
        .add(13, 'months')
        .startOf('day')
        .toISOString()}&type=va`,
    ),
    { data: va },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment().format(
        'YYYY-MM-DD',
      )}&end_date=${moment()
        .add(13, 'months')
        .format('YYYY-MM-DD')}&type=cc`,
    ),
    { data: cc },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?start_date=${moment()
        .add(-30, 'days')
        .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
    ),
    { data: requests },
  );
}

export function mockPastAppointmentInfo({ va = [], cc = [] }) {
  mockFetch();
  setFetchJSONResponse(global.fetch, { data: [] });
  const vaUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${moment()
    .startOf('day')
    .add(-3, 'months')
    .toISOString()}&end_date=${moment()
    .startOf('day')
    .toISOString()}&type=va`;

  setFetchJSONResponse(global.fetch.withArgs(vaUrl), { data: va });
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .add(-3, 'months')
        .format('YYYY-MM-DD')}&end_date=${moment().format(
        'YYYY-MM-DD',
      )}&type=cc`,
    ),
    { data: cc },
  );
}

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

export function mockFacilitiesFetch(ids, facilities) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va?ids=${ids}`),
    { data: facilities },
  );
}

export function mockVACancelFetches(id, reasons) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va/${id}`),
    { data: reasons },
  );
}

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

  const appointment = getVAAppointmentMock();
  appointment.attributes = {
    ...appointment.attributes,
    startDate: moment().format(),
    facilityId: siteId,
    sta6aid: facilityId,
    clinicId: clinics[0]?.id,
  };
  appointment.attributes.vdsAppointments[0].currentStatus = 'FUTURE';
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(6, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .toISOString()}&type=va`,
    ),
    { data: pastClinics && clinics.length ? [appointment] : [] },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(12, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .subtract(6, 'months')
        .toISOString()}&type=va`,
    ),
    { data: [] },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(18, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .subtract(12, 'months')
        .toISOString()}&type=va`,
    ),
    { data: [] },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .subtract(24, 'months')
        .toISOString()}&end_date=${moment()
        .startOf('day')
        .subtract(18, 'months')
        .toISOString()}&type=va`,
    ),
    { data: [] },
  );
}
