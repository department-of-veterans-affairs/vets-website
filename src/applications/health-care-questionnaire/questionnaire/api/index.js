import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA = window.Cypress || environment.isLocalhost();

const loadAppointment = async () => {
  let promise;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import('./appointment-data.json').then(module => {
          resolve(module.default);
        });
      }, 0);
    });
  } else {
    const url = '/health_quest/v0/appointments/123123';
    promise = apiRequest(`${environment.API_URL}${url}`);
  }
  return promise;
};

export { loadAppointment };
