import appendQuery from 'append-query';
import { getTestFacilityId } from '../../utils/appointment';
import {
  apiRequestWithUrl,
  parseApiListWithErrors,
  parseApiList,
  parseApiObject,
} from '../utils';

const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};
export function postAppointment(appointment) {
  return apiRequestWithUrl('/vaos/v2/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...acheronHeader.headers,
    },
    body: JSON.stringify(appointment),
  }).then(parseApiObject);
}

export function putAppointment(id, appointment) {
  return apiRequestWithUrl(`/vaos/v2/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...acheronHeader.headers,
    },
    body: JSON.stringify(appointment),
  }).then(parseApiObject);
}

export function getAppointments({
  startDate,
  endDate,
  statuses = [],
  avs = false,
  fetchClaimStatus = false,
  includeEPS = false,
}) {
  const options = {
    method: 'GET',
  };
  const includeParams = ['facilities', 'clinics'];
  if (avs) {
    includeParams.push('avs');
  }
  if (fetchClaimStatus) {
    includeParams.push('travel_pay_claims');
  }
  if (includeEPS) {
    includeParams.push('eps');
  }
  return apiRequestWithUrl(
    `/vaos/v2/appointments?_include=${includeParams
      .map(String)
      .join(',')}&start=${startDate}&end=${endDate}&${statuses
      .map(status => `statuses[]=${status}`)
      .join('&')}`,
    { ...options, ...acheronHeader },
  ).then(parseApiListWithErrors);
}

export function getAppointment(id, avs = false, fetchClaimStatus = false) {
  const options = {
    method: 'GET',
  };
  const includeParams = ['facilities', 'clinics'];
  if (avs) {
    includeParams.push('avs');
  }
  if (fetchClaimStatus) {
    includeParams.push('travel_pay_claims');
  }
  return apiRequestWithUrl(
    `/vaos/v2/appointments/${id}?_include=${includeParams
      .map(String)
      .join(',')}`,
    { ...options, ...acheronHeader },
  ).then(parseApiObject);
}

export function getFacilities(ids, children = false) {
  return apiRequestWithUrl(
    `/vaos/v2/facilities?children=${children}&${ids
      .map(id => `ids[]=${getTestFacilityId(id)}`)
      .join('&')}`,
  ).then(parseApiList);
}

export function getClinics({ locationId, clinicIds, typeOfCareId }) {
  const url = `/vaos/v2/locations/${locationId}/clinics`;
  return apiRequestWithUrl(
    appendQuery(
      url,
      // eslint-disable-next-line camelcase
      { clinic_ids: clinicIds, clinical_service: typeOfCareId },
      { removeNull: true },
    ),
  ).then(parseApiList);
}

export function getPatientEligibility(
  locationId,
  typeOfCareId,
  schedulingType,
) {
  return apiRequestWithUrl(
    `/vaos/v2/eligibility?facility_id=${locationId}&clinical_service_id=${typeOfCareId}&type=${schedulingType}`,
  ).then(parseApiObject);
}

export function getPatientRelationships({ locationId, typeOfCareId }) {
  return apiRequestWithUrl(
    `/vaos/v2/relationships?facility_id=${locationId}&clinical_service_id=${typeOfCareId}`,
  );
}

export function getFacilityById(id) {
  return apiRequestWithUrl(`/vaos/v2/facilities/${id}`).then(parseApiObject);
}

export function getSchedulingConfigurations(locationIds, ccEnabled = null) {
  let ccEnabledParam = '';
  if (ccEnabled !== null) {
    ccEnabledParam = `&cc_enabled=${ccEnabled}`;
  }

  return apiRequestWithUrl(
    `/vaos/v2/scheduling/configurations?${locationIds
      .map(id => `facility_ids[]=${id}`)
      .join('&')}${ccEnabledParam}`,
    {
      method: 'GET',
    },
  ).then(parseApiList);
}

export function getAvailableV2Slots(facilityId, clinicId, startDate, endDate) {
  return apiRequestWithUrl(
    `/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?start=${startDate}&end=${endDate}`,
  ).then(parseApiList);
}

export function getCommunityCareV2(typeOfCare) {
  return apiRequestWithUrl(
    `/vaos/v2/community_care/eligibility/${typeOfCare}`,
  ).then(parseApiObject);
}

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
    `/facilities_api/v2/ccp/provider?latitude=${latitude}&longitude=${longitude}&radius=${radius}&per_page=${perPage}&page=${page}&${bboxQuery}&${specialtiesQuery}&trim=true`,
  ).then(parseApiList);
}
