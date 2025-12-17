import appendQuery from 'append-query';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTestFacilityId } from '../../utils/appointment';
import { DATE_FORMATS } from '../../utils/constants';
import { removeEmpty } from '../../utils/object';
import {
  apiRequestWithUrl,
  parseApiList,
  parseApiListWithErrors,
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
      .join(',')}&start=${format(startDate, 'yyyy-MM-dd')}&end=${format(
      endDate,
      'yyy-MM-dd',
    )}&${statuses.map(status => `statuses[]=${status}`).join('&')}`,
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

export function getFacilities(
  ids,
  children = false,
  sortByRecentLocations = false,
) {
  const baseUrl = `/vaos/v2/facilities?children=${children}&${ids
    .map(id => `ids[]=${getTestFacilityId(id)}`)
    .join('&')}`;

  const url = sortByRecentLocations
    ? `${baseUrl}&sort_by=recentLocations`
    : baseUrl;

  return apiRequestWithUrl(url).then(parseApiList);
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

export function getPatientRelationships({
  locationId,
  typeOfCareId,
  hasAvailabilityBefore,
}) {
  return apiRequestWithUrl(
    `/vaos/v2/relationships?facility_id=${locationId}&clinical_service_id=${typeOfCareId}&has_availability_before=${formatInTimeZone(
      hasAvailabilityBefore,
      'UTC',
      DATE_FORMATS.ISODateTimeUTC,
    )}`,
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

export function getAvailableV2Slots({
  facilityId,
  clinicId,
  typeOfCare,
  provider,
  startDate,
  endDate,
}) {
  const paramsObj = {
    // eslint-disable-next-line camelcase
    clinical_service: clinicId ? null : typeOfCare,
    // eslint-disable-next-line camelcase
    provider_id: provider,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };

  // Construct the parameter string and remove all keys that have values of null
  // or undefined
  const searchParams = new URLSearchParams(removeEmpty(paramsObj)).toString();

  // For both OH and VistA searches the base URL looks like this
  let baseUrl = `/vaos/v2/locations/${facilityId}`;

  // If a clinicId is passed, we are querying a VistA location and need to
  // add the clinicId to the baseUrl
  if (clinicId) {
    const selectedClinicId = clinicId.includes('_')
      ? clinicId.split('_')[1]
      : clinicId;
    baseUrl = `${baseUrl}/clinics/${selectedClinicId}`;
  }

  // Adds the parameters to the baseUrl
  baseUrl = `${baseUrl}/slots?${searchParams}`;

  return apiRequestWithUrl(baseUrl).then(parseApiList);
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
