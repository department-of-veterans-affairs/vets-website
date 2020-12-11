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

export function mockAppointmentInfo({
  va = [],
  vaError = false,
  cc = [],
  requests = [],
}) {
  mockFetch();

  const baseUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${moment()
    .startOf('day')
    .toISOString()}&end_date=${moment()
    .add(13, 'months')
    .startOf('day')
    .toISOString()}`;

  const vaUrl = `${baseUrl}&type=va`;
  const ccUrl = `${baseUrl}&type=cc`;

  if (vaError) {
    setFetchJSONFailure(global.fetch.withArgs(vaUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(vaUrl), { data: va });
  }

  setFetchJSONResponse(global.fetch.withArgs(ccUrl), { data: cc });

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
    global.fetch.withArgs(
      `${environment.API_URL}/v1/facilities/va?ids=${ids}&per_page=${
        ids.split(',').length
      }`,
    ),
    { data: facilities },
  );
}

export function mockFacilityFetch(id, facility) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va/${id}`),
    { data: facility },
  );
}

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

export function mockCCEligibility(typeOfCare, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/community_care/eligibility/${typeOfCare}`,
    ),
    {
      data,
    },
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

export function mockRequestSubmit(type, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?type=${type}`,
    ),
    { data },
  );
}

export function mockMessagesFetch(id, data) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests/${id}/messages`,
    ),
    { data },
  );
}

export function mockAppointmentSubmit(data) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v0/appointments`),
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
