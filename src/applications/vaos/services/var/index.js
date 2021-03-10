import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  apiRequestWithMocks,
  parseApiList,
  parseApiListWithErrors,
  parseApiObject,
} from '../utils';

function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  if (!environment.isProduction() && facilityId.startsWith('984')) {
    return facilityId.replace('984', '552');
  }

  return facilityId;
}

export function getConfirmedAppointments(type, startDate, endDate) {
  return apiRequestWithMocks(
    `/vaos/v0/appointments?start_date=${startDate}&end_date=${endDate}&type=${type}`,
  ).then(parseApiListWithErrors);
}

export function getPendingAppointments(startDate, endDate) {
  return apiRequestWithMocks(
    `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
  ).then(parseApiList);
}

export function getPendingAppointment(id) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests/${id}`).then(
    parseApiObject,
  );
}

export function getConfirmedAppointment(id, type) {
  return apiRequestWithMocks(`/vaos/v0/appointments/${type}/${id}`).then(
    parseApiObject,
  );
}

export function getRequestMessages(requestId) {
  return apiRequestWithMocks(
    `/vaos/v0/appointment_requests/${requestId}/messages`,
  ).then(resp => resp.data);
}

// This request takes a while, so we're going to call it early
// and we need a way to wait for an in progress call to finish
// So this memoizes the promise and returns it to the caller
export const getLongTermAppointmentHistory = (() => {
  const MAX_HISTORY = 24;
  const MONTH_CHUNK = 12;
  let promise = null;

  return () => {
    if (!promise || navigator.userAgent === 'node.js') {
      const appointments = [];
      const ranges = [];
      let currentMonths = 0;

      // Creating an array of start and end dates for each chunk
      while (currentMonths < MAX_HISTORY) {
        ranges.push([
          moment()
            .startOf('day')
            .subtract(currentMonths + MONTH_CHUNK, 'months')
            .toISOString(),
          moment()
            .subtract(currentMonths, 'months')
            .startOf('day')
            .toISOString(),
        ]);
        currentMonths += MONTH_CHUNK;
      }

      // This is weird, but hopefully clear. There are two chunks with date
      // ranges from the array created above. We're trying to run them serially,
      // because we want to be careful about overloading the upstream service,
      // so Promise.all doesn't fit here
      promise = getConfirmedAppointments('va', ranges[0][0], ranges[0][1])
        .then(({ data }) => appointments.push(...data))
        .then(() => getConfirmedAppointments('va', ranges[1][0], ranges[1][1]))
        .then(({ data }) => appointments.push(...data))
        .then(() => appointments);
    }
    return promise;
  };
})();

export function getParentFacilities(systemIds) {
  const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

  return apiRequestWithMocks(`/vaos/v0/facilities?${idList}`).then(
    parseApiList,
  );
}

export function getFacilitiesBySystemAndTypeOfCare(
  systemId,
  parentId,
  typeOfCareId,
) {
  return apiRequestWithMocks(
    `/vaos/v0/systems/${systemId}/direct_scheduling_facilities?type_of_care_id=${typeOfCareId}&parent_code=${parentId}`,
  ).then(parseApiList);
}

export function getCommunityCare(typeOfCare) {
  return apiRequestWithMocks(
    `/vaos/v0/community_care/eligibility/${typeOfCare}`,
  ).then(parseApiObject);
}

export function checkPastVisits(
  systemId,
  facilityId,
  typeOfCareId,
  directOrRequest,
) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/visits/${directOrRequest}?system_id=${systemId}&type_of_care_id=${typeOfCareId}`,
  ).then(parseApiObject);
}

export function getRequestLimits(facilityId, typeOfCareId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/limits?type_of_care_id=${typeOfCareId}`,
  ).then(parseApiObject);
}

export function getAvailableClinics(facilityId, typeOfCareId, systemId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${systemId}`,
  ).then(parseApiList);
}

export function getFacilityInfo(facilityId) {
  return apiRequestWithMocks(
    `/v1/facilities/va/vha_${getStagingId(facilityId)}`,
  ).then(parseApiObject);
}

export function getFacilitiesInfo(facilityIds) {
  const idList = facilityIds
    .map(getStagingId)
    .map(id => `vha_${id}`)
    .join(',');

  return apiRequestWithMocks(
    `/v1/facilities/va?ids=${idList}&per_page=${facilityIds.length}`,
  ).then(parseApiList);
}

export function getCommunityCareFacilities({
  latitude,
  longitude,
  radius,
  bbox,
  specialties,
  page = 1,
  perPage = 10,
}) {
  const bboxQuery = bbox.map(c => `bbox[]=${c}`).join('&');
  const specialtiesQuery = specialties.map(s => `specialties[]=${s}`).join('&');

  return apiRequestWithMocks(
    `/v1/facilities/ccp?latitude=${latitude}&longitude=${longitude}&radius=${radius}&per_page=${perPage}&page=${page}&${bboxQuery}&${specialtiesQuery}&type=provider&trim=true`,
  ).then(parseApiList);
}

export function getSitesSupportingVAR(systemIds) {
  return apiRequestWithMocks(
    `/vaos/v0/community_care/supported_sites?${systemIds
      .map(id => `site_codes[]=${id}`)
      .join('&')}`,
  ).then(parseApiList);
}

export function getAvailableSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate}`,
  ).then(parseApiList);
}

export function getCancelReasons(systemId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${systemId}/cancel_reasons`,
  ).then(parseApiList);
}

export function updateAppointment(appt) {
  return apiRequestWithMocks(`/vaos/v0/appointments/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appt),
  });
}

export function updateRequest(req) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests/${req.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }).then(parseApiObject);
}

export function submitRequest(type, request) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then(parseApiObject);
}

export function submitAppointment(appointment) {
  return apiRequestWithMocks('/vaos/v0/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
}

export function sendRequestMessage(id, messageText) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText }),
  }).then(parseApiObject);
}

export function getPreferences() {
  return apiRequestWithMocks(`/vaos/v0/preferences`).then(parseApiObject);
}

export function updatePreferences(data) {
  return apiRequestWithMocks(`/vaos/v0/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(parseApiObject);
}

export function getRequestEligibilityCriteria(sites) {
  return apiRequestWithMocks(
    `/vaos/v0/request_eligibility_criteria?${sites
      .map(site => `parent_sites[]=${site}`)
      .join('&')}`,
  ).then(parseApiList);
}

export function getDirectBookingEligibilityCriteria(sites) {
  return apiRequestWithMocks(
    `/vaos/v0/direct_booking_eligibility_criteria?${sites
      .map(site => `parent_sites[]=${site}`)
      .join('&')}`,
  ).then(parseApiList);
}
