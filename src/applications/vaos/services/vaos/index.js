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

export function getAppointments(start, end, statuses = []) {
  const options = {
    method: 'GET',
  };
  return apiRequestWithUrl(
    `/vaos/v2/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
      .map(status => `statuses[]=${status}`)
      .join('&')}`,
    { ...options, ...acheronHeader },
  ).then(parseApiListWithErrors);
}

export function getAppointment(id) {
  const options = {
    method: 'GET',
  };
  return apiRequestWithUrl(
    `/vaos/v2/appointments/${id}?_include=facilities,clinics`,
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
