import environment from 'platform/utilities/environment';
import { apiRequestWithUrl, parseApiList, parseApiObject } from '../utils';

export function getStagingId(facilityId) {
  if (
    (!environment.isProduction() && facilityId.startsWith('983')) ||
    window.Cypress
  ) {
    return facilityId.replace('983', '442');
  }

  if (
    (!environment.isProduction() && facilityId.startsWith('984')) ||
    window.Cypress
  ) {
    return facilityId.replace('984', '552');
  }

  return facilityId;
}

export function getConfirmedAppointment(id, type) {
  return apiRequestWithUrl(`/vaos/v0/appointments/${type}/${id}`).then(
    parseApiObject,
  );
}

export function getParentFacilities(systemIds) {
  const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

  return apiRequestWithUrl(`/vaos/v0/facilities?${idList}`).then(parseApiList);
}

export function getCommunityCare(typeOfCare) {
  return apiRequestWithUrl(
    `/vaos/v0/community_care/eligibility/${typeOfCare}`,
  ).then(parseApiObject);
}

export function checkPastVisits(
  systemId,
  facilityId,
  typeOfCareId,
  directOrRequest,
) {
  return apiRequestWithUrl(
    `/vaos/v0/facilities/${facilityId}/visits/${directOrRequest}?system_id=${systemId}&type_of_care_id=${typeOfCareId}`,
  ).then(parseApiObject);
}

export function getRequestLimits(facilityIds, typeOfCareId) {
  let url = `/vaos/v0/facilities/limits?type_of_care_id=${typeOfCareId}&`;
  if (Array.isArray(facilityIds)) {
    url += facilityIds.map(id => `facility_ids[]=${id}`).join('&');
  } else {
    url += `facility_ids[]=${facilityIds}`;
  }
  return apiRequestWithUrl(url).then(parseApiList);
}

export function getAvailableClinics(facilityId, typeOfCareId, systemId) {
  return apiRequestWithUrl(
    `/vaos/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${systemId}`,
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

  return apiRequestWithUrl(
    `/facilities_api/v1/ccp/provider?latitude=${latitude}&longitude=${longitude}&radius=${radius}&per_page=${perPage}&page=${page}&${bboxQuery}&${specialtiesQuery}&trim=true`,
  ).then(parseApiList);
}

export function getCommunityCareFacility(id) {
  return apiRequestWithUrl(`/v1/facilities/ccp/${id}`, {
    method: 'GET',
  }).then(parseApiObject);
}

export function getAvailableSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  return apiRequestWithUrl(
    `/vaos/v0/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate}`,
  ).then(parseApiList);
}

export function submitRequest(type, request) {
  return apiRequestWithUrl(`/vaos/v0/appointment_requests?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then(parseApiObject);
}

export function submitAppointment(appointment) {
  return apiRequestWithUrl('/vaos/v0/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
}

export function getRequestEligibilityCriteria(sites) {
  return apiRequestWithUrl(
    `/vaos/v0/request_eligibility_criteria?${sites
      .map(site => `parent_sites[]=${site}`)
      .join('&')}`,
  ).then(parseApiList);
}

export function getDirectBookingEligibilityCriteria(sites) {
  return apiRequestWithUrl(
    `/vaos/v0/direct_booking_eligibility_criteria?${sites
      .map(site => `parent_sites[]=${site}`)
      .join('&')}`,
  ).then(parseApiList);
}
