import moment from 'moment';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

// This wil go away once we stop mocking api calls
const TEST_TIMEOUT = navigator.userAgent === 'node.js' ? 1 : null;
function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  if (!environment.isProduction() && facilityId.startsWith('984')) {
    return facilityId.replace('984', '552');
  }

  return facilityId;
}

const USE_MOCK_DATA = environment.isLocalhost();

export function getConfirmedAppointments(type, startDate, endDate) {
  let promise;
  if (USE_MOCK_DATA) {
    if (type === 'va') {
      promise = import('./confirmed_va.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = import('./confirmed_cc.json').then(
        module => (module.default ? module.default : module),
      );
    }
  } else {
    promise = apiRequest(
      `/vaos/appointments?start_date=${startDate}&end_date=${endDate}&type=${type}`,
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
    promise = apiRequest(
      `/vaos/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
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
    promise = apiRequest(`/vaos/appointment_requests/${requestId}/messages`);
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
  // eslint-disable-next-line no-unused-vars
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

export const getUserIdentifiers = (() => {
  let promise = null;

  return () => {
    if (promise && navigator.userAgent !== 'node.js') {
      return promise;
    }

    if (USE_MOCK_DATA) {
      promise = import('./systems.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = apiRequest('/vaos/systems');
    }

    promise = promise.then(json => json.data.map(item => item.attributes));

    return promise;
  };
})();

export function getSystemIdentifiers() {
  return getUserIdentifiers().then(data =>
    data
      .filter(id => id.assigningAuthority.startsWith('dfn-'))
      .map(id => id.assigningCode),
  );
}

export function getSystemDetails(systemIds) {
  let promise;

  if (USE_MOCK_DATA) {
    promise = import('./facilities.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    const idList = systemIds.map(id => `facility_codes[]=${id}`).join('&');

    promise = apiRequest(`/vaos/facilities?${idList}`);
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getFacilitiesBySystemAndTypeOfCare(systemId, typeOfCareId) {
  let promise;
  if (USE_MOCK_DATA) {
    if (systemId === '984') {
      promise = import('./facilities_984.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = import('./facilities_983.json').then(
        module => (module.default ? module.default : module),
      );
    }
  } else {
    promise = apiRequest(
      `/vaos/systems/${systemId}/direct_scheduling_facilities?type_of_care_id=${typeOfCareId}&parent_code=${systemId}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

export function getCommunityCare() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        isEligible: true,
        reason: 'User is within x miles of facility',
        effectiveDate: '2017-10-08T23:35:12-05:00',
      });
    }, TEST_TIMEOUT || 1500);
  });
}

// GET /vaos/facilities/{facilityId}/visits/{directOrRequest}
// eslint-disable-next-line no-unused-vars
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
    promise = apiRequest(
      `/vaos/facilities/${facilityId}/visits/${directOrRequest}?system_id=${systemId}&type_of_care_id=${typeOfCareId}`,
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
    promise = apiRequest(
      `/vaos/facilities/${facilityId}/limits?type_of_care_id=${typeOfCareId}`,
    );
  }

  return promise.then(resp => resp.data.attributes);
}

export function getClinics(facilityId, typeOfCareId, systemId) {
  let promise;
  if (USE_MOCK_DATA) {
    if (facilityId.includes('983')) {
      promise = import('./clinicList983.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = Promise.resolve({ data: [] });
    }
  } else {
    promise = apiRequest(
      `/vaos/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${systemId}`,
    );
  }

  return promise.then(resp =>
    resp.data.map(item => ({ ...item.attributes, id: item.id })),
  );
}

// GET /vaos/systems/{systemId}/pact
// eslint-disable-next-line no-unused-vars
export function getPacTeam(systemId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (systemId === '983') {
        import('./pact.json').then(module =>
          resolve(module.default ? module.default : module),
        );
      } else {
        resolve([]);
      }
    }, 750);
  });
}

export function getFacilityInfo(facilityId) {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          attributes: {
            name: 'Cheyenne VA Medical Center',
            address: {
              physical: {
                zip: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                address1: '2360 East Pershing Boulevard',
                address2: null,
                address3: null,
              },
            },
          },
        });
      }, TEST_TIMEOUT || 2000);
    });
  }
  return apiRequest(`/facilities/va/vha_${getStagingId(facilityId)}`).then(
    resp => resp.data,
  );
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

export function getSitesSupportingVAR() {
  return new Promise(resolve => {
    setTimeout(() => {
      import('./sites-supporting-var.json').then(module =>
        resolve(module.default ? module.default : module),
      );
    }, TEST_TIMEOUT || 1500);
  });
}

export function getAvailableSlots(
  facilityId,
  typeOfCareId,
  clinicId,
  startDate,
  endDate,
) {
  let promise;

  if (false && USE_MOCK_DATA) {
    promise = import('./slots.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    promise = apiRequest(
      `/vaos/facilities/${facilityId}/available_appointments?type_of_care_id=${typeOfCareId}&clinic_ids[]=${clinicId}&start_date=${startDate}&end_date=${endDate}`,
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
    promise = apiRequest(`/vaos/facilities/${systemId}/cancel_reasons`);
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
    promise = apiRequest(`/vaos/appointments/cancel`, {
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
    promise = Promise.resolve();
  } else {
    promise = apiRequest(`/vaos/appointment_requests/${req.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  }

  return promise;
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
    promise = apiRequest(`/vaos/appointment_requests?type=${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  return promise.then(resp => ({ ...resp.data.attributes, id: resp.data.id }));
}

export function submitAppointment(appointment) {
  let promise;
  if (USE_MOCK_DATA || true) {
    promise = Promise.resolve({
      data: {
        attributes: {},
      },
    });
  } else {
    promise = apiRequest('/vaos/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
  }

  return promise.then(resp => resp.data.attributes);
}

export function sendRequestMessage(id, messageText) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({ data: { attributes: {} } });
  } else {
    promise = apiRequest(`/vaos/appointment_requests/${id}/messages`, {
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
    promise = Promise.resolve({ data: { attributes: {} } });
  } else {
    promise = apiRequest(`/vaos/preferences`);
  }

  return promise.then(resp => resp.data.attributes);
}

export function updatePreferences(data) {
  let promise;
  if (USE_MOCK_DATA) {
    promise = Promise.resolve({ data: { attributes: {} } });
  } else {
    promise = apiRequest(`/vaos/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  return promise.then(resp => resp.data.attributes);
}
