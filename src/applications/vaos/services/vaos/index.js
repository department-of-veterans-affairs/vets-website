import { apiRequestWithMocks, parseApiObject } from '../utils';

export function postAppointment(appointment) {
  return apiRequestWithMocks('/vaos/v2/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  }).then(parseApiObject);
}
