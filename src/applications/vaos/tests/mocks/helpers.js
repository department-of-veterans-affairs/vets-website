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
        .startOf('day')
        .format()}&end_date=${moment()
        .startOf('day')
        .format()}&type=cc`,
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
        .subtract(6, 'months')
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

export function mockAppointmentSlotFetch({
  siteId,
  typeOfCareId,
  preferredDate,
  length = '20',
  clinicId,
  slots,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v0/facilities/${siteId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}` +
        `&start_date=${preferredDate
          .clone()
          .startOf('month')
          .format('YYYY-MM-DD')}` +
        `&end_date=${preferredDate
          .clone()
          .add(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD')}`,
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

export function mockRequestSubmit(type, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?type=${type}`,
    ),
    { data },
  );
}

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
