import { apiRequestWithUrl, parseApiList, parseApiObject } from '../utils';

export function postAppointment(appointment) {
  return apiRequestWithUrl('/vaos/v2/appointments', {
    method: 'POST',
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

export function getParentFacilitiesV2(systemIds, children = false) {
  return apiRequestWithUrl(
    `/vaos/v2/facilities?children=${children}&${systemIds
      .map(id => `ids[]=${id}`)
      .join('&')}`,
  ).then(parseApiList);
}
