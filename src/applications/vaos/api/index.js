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

// GET /vaos/appointments
// eslint-disable-next-line no-unused-vars
export function getConfirmedAppointments(type, startDate, endDate) {
  let promise;
  if (environment.isLocalhost()) {
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

// GET /vaos/requests
// eslint-disable-next-line no-unused-vars
export function getPendingAppointments(startDate, endDate) {
  let promise;
  if (environment.isLocalhost()) {
    promise = import('./requests.json').then(
      module => (module.default ? module.default : module),
    );
  } else {
    promise = apiRequest(
      `/vaos/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
    );
  }

  return promise.then(resp => resp.data.map(item => item.attributes));
}

export function getRequestMessages(requestId) {
  let promise;
  if (environment.isLocalhost()) {
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
      let currentMonths = 0;

      // This creates calls in six month chunks until we hit
      // two years back. Done serially to lighten backend load
      while (currentMonths < MAX_HISTORY) {
        promise = getConfirmedAppointments(
          'va',
          moment()
            .startOf('day')
            .subtract(currentMonths + MONTH_CHUNK, 'months')
            .toISOString(),
          moment()
            .subtract(currentMonths, 'months')
            .startOf('day')
            .toISOString(),
        ).then(newAppts => appointments.push(...newAppts));

        currentMonths += MONTH_CHUNK;
      }

      promise = promise.then(() => appointments);
    }
    return promise;
  };
})();

// GET /vaos/systems
export const getSystemIdentifiers = (() => {
  let promise = null;

  return () => {
    if (promise && navigator.userAgent !== 'node.js') {
      return promise;
    }

    if (environment.isLocalhost()) {
      promise = import('./systems.json')
        .then(module => (module.default ? module.default : module))
        .then(json => json.data.map(item => item.attributes));
    } else {
      promise = fetch(`${environment.API_URL}/v0/vaos/systems`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Key-Inflection': 'camel',
        },
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }

          throw new Error(resp.status);
        })
        .then(json => json.data.map(item => item.attributes));
    }

    return promise;
  };
})();

// GET /vaos/facilities
// eslint-disable-next-line no-unused-vars
export function getSystemDetails(systemIds) {
  return new Promise(resolve => {
    setTimeout(() => {
      import('./facilities.json').then(module =>
        resolve(module.default ? module.default : module),
      );
    }, TEST_TIMEOUT || 1000);
  });
}

// GET /vaos/systems/{systemId}/facilities
// eslint-disable-next-line no-unused-vars
export function getFacilitiesBySystemAndTypeOfCare(systemId, typeOfCareId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (systemId === '984') {
        import('./facilities_984.json').then(module =>
          resolve(module.default ? module.default : module),
        );
      } else {
        import('./facilities_983.json').then(module =>
          resolve(module.default ? module.default : module),
        );
      }
    }, TEST_TIMEOUT || 1000);
  });
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
export function checkPastVisits(facilityId, typeOfCareId, directOrRequest) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (directOrRequest === 'direct') {
        resolve({
          durationInMonths: 24,
          hasVisitedInPastMonths: !facilityId.includes('984'),
        });
      } else {
        resolve({
          durationInMonths: 12,
          hasVisitedInPastMonths: facilityId !== '984',
        });
      }
    }, 500);
  });
}

// GET /vaos/facilities/{facilityId}/limits
// eslint-disable-next-line no-unused-vars
export function getRequestLimits(facilityId, typeOfCareId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        requestLimit: 1,
        numberOfRequests: facilityId.includes('984') ? 1 : 0,
      });
    }, 500);
  });
}

export function getClinics(facilityId, typeOfCareId) {
  let promise;
  if (environment.isLocalhost()) {
    if (facilityId.includes('983')) {
      promise = import('./clinicList983.json').then(
        module => (module.default ? module.default : module),
      );
    } else {
      promise = Promise.resolve({ data: [] });
    }
  } else {
    promise = apiRequest(
      `/vaos/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${facilityId.substring(
        0,
        3,
      )}`,
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
  if (environment.isLocalhost()) {
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

  if (environment.isLocalhost()) {
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

export function getAvailableSlots() {
  return new Promise(resolve => {
    setTimeout(() => {
      import('./slots.json').then(module =>
        resolve(module.default ? module.default : module),
      );
    }, 500);
  });
}

export function getCancelReasons(systemId) {
  let promise;
  if (environment.isLocalhost()) {
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

// PUT /vaos/appointments
// eslint-disable-next-line no-unused-vars
export function updateAppointment(appt) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

// PUT /vaos/requests
// eslint-disable-next-line no-unused-vars
export function updateRequest(appt) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}
