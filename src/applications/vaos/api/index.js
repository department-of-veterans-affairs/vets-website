import moment from 'moment';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { generateMockSlots } from '../utils/calendar';

function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  if (!environment.isProduction() && facilityId.startsWith('984')) {
    return facilityId.replace('984', '552');
  }

  return facilityId;
}

const USE_MOCK_DATA = false;
// environment.isLocalhost() && !environment.API_URL.includes('review.vetsgov');

function vaosApiRequest(url, ...options) {
  return apiRequest(`${environment.API_URL}/vaos${url}`, ...options);
}

export function getConfirmedAppointments(type, startDate, endDate) {
  let promise;
  if (USE_MOCK_DATA) {
    if (type === 'va') {
      promise = new Promise(resolve =>
        setTimeout(() => {
          import('./confirmed_va.json').then(module => {
            resolve(module.default ? module.default : module);
          });
        }, 500),
      );
    } else {
      promise = new Promise(resolve =>
        setTimeout(() => {
          import('./confirmed_cc.json').then(module => {
            resolve(module.default ? module.default : module);
          });
        }, 500),
      );
    }
  } else {
    promise = vaosApiRequest(
      `/v0/appointments?start_date=${startDate}&end_date=${endDate}&type=${type}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getPendingAppointments(startDate, endDate) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = import('./requests.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    promise = vaosApiRequest(
      `/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getRequestMessages(requestId) {
  let promise;
  if (USE_MOCK_DATA) {
    if (requestId === '8a48912a6c2409b9016c525a4d490190') {
      promise = import('./messages_0190.json').then(
        module => (module.default ? module.default : module),
      );
    } else if (requestId === '8a48912a6cab0202016cb4fcaa8b0038') {
      promise = import('./messages_0038.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = new Promise(res => res({ data: [] }));
    }
  } else {
    promise = vaosApiRequest(`/v0/appointment_requests/${requestId}/messages`);
  }

  return promise.then(resp => resp.data);
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
  let promise;

  if (USE_MOCK_DATA) {
    promise = import('./facilities.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

    promise = vaosApiRequest(`/v0/facilities?${idList}`);
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getFacilitiesBySystemAndTypeOfCare(
  systemId,
  parentId,
  typeOfCareId,
) {
  let promise;
  if (USE_MOCK_DATA) {
    if (parentId === '984') {
      promise = import('./facilities_984.json').then(
        module => (module.default ? module.default : module),
      );
    } else if (parentId === '983A6') {
      promise = import('./facilities_983A6.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = import('./facilities_983.json').then(
        module => (module.default ? module.default : module),
      );
    }
  } else {
    promise = vaosApiRequest(
      `/v0/systems/${systemId}/direct_scheduling_facilities?type_of_care_id=${typeOfCareId}&parent_code=${parentId}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getCommunityCare(typeOfCare) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({
      data: {
        id: 'PrimaryCare',
        type: 'cc_eligibility',
        attributes: { eligible: true },
      },
    });
  } else {
    promise = vaosApiRequest(`/v0/community_care/eligibility/${typeOfCare}`);
  }

  return promise.then(resp => ({ ...resp.data.attributes, id: resp.data.id }));
}

export function checkPastVisits(
  systemId,
  facilityId,
  typeOfCareId,
  directOrRequest,
) {
  let promise;
  if (USE_MOCK_DATA) {
    let attributes;
    if (directOrRequest === 'direct') {
      attributes = {
        durationInMonths: 24,
        hasVisitedInPastMonths: !facilityId.includes('984'),
      };
    } else {
      attributes = {
        durationInMonths: 12,
        hasVisitedInPastMonths: facilityId !== '984',
      };
    }

    promise = Promise.resolve({
      data: {
        id: '05084676-77a1-4754-b4e7-3638cb3124e5',
        type: 'facility_visit',
        attributes,
      },
    });
  } else {
    promise = vaosApiRequest(
      `/v0/facilities/${facilityId}/visits/${directOrRequest}?system_id=${systemId}&type_of_care_id=${typeOfCareId}`,
    );
  }

  return promise.then(resp => resp.data.attributes);
}

export function getRequestLimits(facilityId, typeOfCareId) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({
      data: {
        attributes: {
          requestLimit: 1,
          numberOfRequests: facilityId.includes('984') ? 1 : 0,
        },
      },
    });
  } else {
    promise = vaosApiRequest(
      `/v0/facilities/${facilityId}/limits?type_of_care_id=${typeOfCareId}`,
    );
  }

  return promise.then(resp => resp.data.attributes);
}

export function getClinicInstitutions(systemId, clinicIds) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = import('./clinics.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    const clinicIdParams = clinicIds.map(id => `clinic_ids[]=${id}`).join('&');
    promise = vaosApiRequest(
      `/v0/systems/${systemId}/clinic_institutions?${clinicIdParams}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id, systemId })),
  );
}

export function getAvailableClinics(facilityId, typeOfCareId, systemId) {
  let promise;
  if (USE_MOCK_DATA) {
    if (facilityId === '983A6') {
      promise = import('./clinicList983.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = Promise.resolve({ data: [] });
    }
  } else {
    promise = vaosApiRequest(
      `/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${systemId}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getPacTeam(systemId) {
  let promise;
  if (USE_MOCK_DATA) {
    if (systemId.includes('983')) {
      promise = import('./pact.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = Promise.resolve({ data: [] });
    }
  } else {
    promise = vaosApiRequest(`/v0/systems/${systemId}/pact`);
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getFacilityInfo(facilityId) {
  let promise;

  if (USE_MOCK_DATA) {
    if (facilityId === '984') {
      promise = import('./facility_details_984.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = import('./facility_details_983.json').then(
        module => (module.default ? module.default : module),
      );
    }
  } else {
    promise = apiRequest(`/facilities/va/vha_${getStagingId(facilityId)}`);
  }
  return promise.then(resp => ({ id: resp.data.id, ...resp.data.attributes }));
}

export function getFacilitiesInfo(facilityIds) {
  let promise;

  if (USE_MOCK_DATA) {
    promise = import('./facility_data.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    const idList = facilityIds
      .map(getStagingId)
      .map(id => `vha_${id}`)
      .join(',');

    promise = apiRequest(`/facilities/va?ids=${idList}`);
  }

  return promise.then(resp => resp.data.map(item => item.attributes));
}

export function getSitesSupportingVAR(systemIds) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = import('./sites-supporting-var.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    promise = vaosApiRequest(
      `/v0/community_care/supported_sites?${systemIds
        .map(id => `site_codes[]=${id}`)
        .join('&')}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ id: item.id, ...item.attributes })),
  );
}

export function getAvailableSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  let promise;

  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import('./slots.json').then(module => {
          const response = module.default ? module.default : module;
          response.data[0].attributes.appointmentTimeSlot = generateMockSlots();
          resolve(response);
        });
      }, 500);
    });
  } else {
    promise = vaosApiRequest(
      `/v0/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getCancelReasons(systemId) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = import('./cancel_reasons.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    promise = vaosApiRequest(`/v0/facilities/${systemId}/cancel_reasons`);
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function updateAppointment(appt) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve();
  } else {
    promise = vaosApiRequest(`/v0/appointments/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt),
    });
  }

  return promise;
}

export function updateRequest(req) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = import('./requests.json')
      .then(module => (module.default ? module.default : module))
      .then(data => ({
        data: {
          id: req.id,
          attributes: {
            ...data.data.find(item => item.id === req.id).attributes,
            status: 'Cancelled',
          },
        },
      }));
  } else {
    promise = vaosApiRequest(`/v0/appointment_requests/${req.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  }

  return promise.then(resp => ({
    ...resp.data.attributes,
    id: resp.data.id,
  }));
}

export function submitRequest(type, request) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({
      data: {
        id: 'testing',
        attributes: {},
      },
    });
  } else {
    promise = vaosApiRequest(`/v0/appointment_requests?type=${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  return promise.then(resp => ({ ...resp.data.attributes, id: resp.data.id }));
}

export function submitAppointment(appointment) {
  if (USE_MOCK_DATA) {
    return Promise.resolve();
  }

  return vaosApiRequest('/v0/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
}

export function sendRequestMessage(id, messageText) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({ data: { attributes: {} } });
  } else {
    promise = vaosApiRequest(`/v0/appointment_requests/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageText }),
    });
  }

  return promise.then(resp => resp.data.attributes);
}

export function getPreferences() {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({ data: { attributes: { emailAllowed: true } } });
  } else {
    promise = vaosApiRequest(`/v0/preferences`);
  }

  return promise.then(resp => resp.data.attributes);
}

export function updatePreferences(data) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({ data: { attributes: {} } });
  } else {
    promise = vaosApiRequest(`/v0/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  return promise.then(resp => resp.data.attributes);
}
