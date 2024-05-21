import { apiRequestWithUrl, parseApiList } from '../utils';

export async function getCommunityCareFacilities({
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
