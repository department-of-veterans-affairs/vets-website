import moment from 'moment';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const USE_MOCK_DATA =
  !window.Cypress &&
  environment.isLocalhost() &&
  !environment.API_URL.includes('review.vetsgov');

async function apiRequestWithMocks(url, options, ...rest) {
  /* istanbul ignore if  */
  if (USE_MOCK_DATA) {
    // This needs to be lazy loaded to keep it out of the main bundle
    const handlers = (await import('../api/handlers')).default;

    // find a matching handler by method and path checks
    const match = handlers.find(handler => {
      return (
        options?.method === handler.method &&
        (typeof handler.path === 'string'
          ? url.endsWith(handler.path)
          : handler.path.test(url))
      );
    });

    if (match) {
      // eslint-disable-next-line no-console
      console.log(`VAOS mock request: ${options?.method || 'GET'} ${url}`);

      // Sometimes it's useful to grab ids or other data from the url, so
      // this passes through matched regex groups
      let groups = [];
      if (match.path instanceof RegExp) {
        groups = match.path.exec(url).slice(1);
      }

      const response =
        typeof match.response === 'function'
          ? match.response(url, {
              requestData: options?.body ? JSON.parse(options.body) : null,
              groups,
            })
          : match.response;

      return new Promise(resolve => {
        setTimeout(() => resolve(response), match.delay || 150);
      });
    }
  }

  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
}

function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  if (!environment.isProduction() && facilityId.startsWith('984')) {
    return facilityId.replace('984', '552');
  }

  return facilityId;
}

export function getConfirmedAppointments(type, startDate, endDate) {
  return apiRequestWithMocks(
    `/vaos/v0/appointments?start_date=${startDate}&end_date=${endDate}&type=${type}`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function getPendingAppointments(startDate, endDate) {
  return apiRequestWithMocks(
    `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function getRequestMessages(requestId) {
  return apiRequestWithMocks(
    `/vaos/v0/appointment_requests/${requestId}/messages`,
  ).then(resp => resp.data);
}

// This request takes a while, so we're going to call it early
// and we need a way to wait for an in progress call to finish
// So this memoizes the promise and returns it to the caller
export const getLongTermAppointmentHistory = (() => {
  const MAX_HISTORY = 24;
  const MONTH_CHUNK = 6;
  let promise = null;

  return () => {
    if (!promise || navigator.userAgent === 'node.js') {
      const appointments = [];
      const ranges = [];
      let currentMonths = 0;

      // Creating an array of start and end dates for each chunk
      while (currentMonths < MAX_HISTORY) {
        ranges.push([
          moment()
            .startOf('day')
            .subtract(currentMonths + MONTH_CHUNK, 'months')
            .toISOString(),
          moment()
            .subtract(currentMonths, 'months')
            .startOf('day')
            .toISOString(),
        ]);
        currentMonths += MONTH_CHUNK;
      }

      // This is weird, but hopefully clear. There are four chunks with date
      // ranges from the array created above. We're trying to run them serially,
      // because we want to be careful about overloading the upstream service,
      // so Promise.all doesn't fit here
      promise = getConfirmedAppointments('va', ranges[0][0], ranges[0][1])
        .then(newAppts => appointments.push(...newAppts))
        .then(() => getConfirmedAppointments('va', ranges[1][0], ranges[1][1]))
        .then(newAppts => appointments.push(...newAppts))
        .then(() => getConfirmedAppointments('va', ranges[2][0], ranges[2][1]))
        .then(newAppts => appointments.push(...newAppts))
        .then(() => getConfirmedAppointments('va', ranges[3][0], ranges[3][1]))
        .then(newAppts => appointments.push(...newAppts))
        .then(() => appointments);
    }
    return promise;
  };
})();

export function getParentFacilities(systemIds) {
  const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

  return apiRequestWithMocks(`/vaos/v0/facilities?${idList}`).then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getFacilitiesBySystemAndTypeOfCare(
  systemId,
  parentId,
  typeOfCareId,
) {
  return apiRequestWithMocks(
    `/vaos/v0/systems/${systemId}/direct_scheduling_facilities?type_of_care_id=${typeOfCareId}&parent_code=${parentId}`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function getCommunityCare(typeOfCare) {
  return apiRequestWithMocks(
    `/vaos/v0/community_care/eligibility/${typeOfCare}`,
  ).then(resp => ({ ...resp.data.attributes, id: resp.data.id }));
}

export function checkPastVisits(
  systemId,
  facilityId,
  typeOfCareId,
  directOrRequest,
) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/visits/${directOrRequest}?system_id=${systemId}&type_of_care_id=${typeOfCareId}`,
  ).then(resp => resp.data.attributes);
}

export function getRequestLimits(facilityId, typeOfCareId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/limits?type_of_care_id=${typeOfCareId}`,
  ).then(resp => ({
    ...resp.data.attributes,
    id: resp.data.id,
  }));
}

export function getAvailableClinics(facilityId, typeOfCareId, systemId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${systemId}`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function getFacilityInfo(facilityId) {
  return apiRequestWithMocks(
    `/v1/facilities/va/vha_${getStagingId(facilityId)}`,
  ).then(resp => ({ id: resp.data.id, ...resp.data.attributes }));
}

export function getFacilitiesInfo(facilityIds) {
  const idList = facilityIds
    .map(getStagingId)
    .map(id => `vha_${id}`)
    .join(',');

  return apiRequestWithMocks(`/v1/facilities/va?ids=${idList}`).then(resp =>
    resp.data.map(item => item.attributes),
  );
}

export function getSitesSupportingVAR(systemIds) {
  return apiRequestWithMocks(
    `/vaos/v0/community_care/supported_sites?${systemIds
      .map(id => `site_codes[]=${id}`)
      .join('&')}`,
  ).then(resp => resp.data.map(item => ({ id: item.id, ...item.attributes })));
}

export function getAvailableSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate}`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function getCancelReasons(systemId) {
  return apiRequestWithMocks(
    `/vaos/v0/facilities/${systemId}/cancel_reasons`,
  ).then(resp => resp.data.map(item => ({ ...item.attributes, id: item.id })));
}

export function updateAppointment(appt) {
  return apiRequestWithMocks(`/vaos/v0/appointments/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appt),
  });
}

export function updateRequest(req) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests/${req.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }).then(resp => ({
    ...resp.data.attributes,
    id: resp.data.id,
  }));
}

export function submitRequest(type, request) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests?type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then(resp => ({ ...resp.data.attributes, id: resp.data.id }));
}

export function submitAppointment(appointment) {
  return apiRequestWithMocks('/vaos/v0/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
}

export function sendRequestMessage(id, messageText) {
  return apiRequestWithMocks(`/vaos/v0/appointment_requests/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText }),
  }).then(resp => resp.data.attributes);
}

export function getPreferences() {
  return apiRequestWithMocks(`/vaos/v0/preferences`).then(
    resp => resp.data.attributes,
  );
}

export function updatePreferences(data) {
  return apiRequestWithMocks(`/vaos/v0/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(resp => resp.data.attributes);
}

export function getRequestEligibilityCriteria(sites) {
  return apiRequestWithMocks(
    `/vaos/v0/request_eligibility_criteria?${sites
      .map(site => `parent_sites[]=${site}`)
      .join('&')}`,
  ).then(resp => resp.data.map(data => data.attributes));
}
