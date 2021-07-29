import { apiRequestWithUrl, parseApiList, parseApiObject } from '../utils';

export function postAppointment(appointment) {
  return apiRequestWithUrl('/vaos/v2/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  }).then(parseApiObject);
}

export function putAppointment(id, appointment) {
  return apiRequestWithUrl(`/vaos/v2/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  }).then(parseApiObject);
}

export function getAppointments(start, end, statuses = []) {
  return apiRequestWithUrl(
    `/vaos/v2/appointments?start=${start}&end=${end}&${statuses
      .map(status => `statuses[]=${status}`)
      .join('&')}`,
    {
      method: 'GET',
    },
  ).then(parseApiList);
}

export function getAppointment(id) {
  return apiRequestWithUrl(`/vaos/v2/appointments/${id}`, {
    method: 'GET',
  }).then(parseApiObject);
}

export function getFacilities(ids, children = false) {
  return apiRequestWithUrl(
    `/vaos/v2/facilities?children=${children}&${ids
      .map(id => `ids[]=${id}`)
      .join('&')}`,
  ).then(parseApiList);
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
