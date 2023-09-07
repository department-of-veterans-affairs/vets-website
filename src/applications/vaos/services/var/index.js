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
