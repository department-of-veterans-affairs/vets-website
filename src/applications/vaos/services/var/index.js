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

export function getParentFacilities(systemIds) {
  const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

  return apiRequestWithUrl(`/vaos/v0/facilities?${idList}`).then(parseApiList);
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

export function submitRequest(type, request) {
  return apiRequestWithUrl(`/vaos/v0/appointment_requests?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then(parseApiObject);
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
