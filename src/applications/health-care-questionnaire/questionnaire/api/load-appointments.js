import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA = window.Cypress || environment.isLocalhost();

const loadAppointment = async id => {
  let promise;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import(/* webpackChunkName: "appointment-data" */ './data.json').then(
          module => {
            const appt = module.default.data.filter(f => f.data.id === id)[0];
            resolve(appt || module.default.data[0]);
          },
        );
      }, 0);
    });
  } else {
    const url = '/health_quest/v0/appointments/123123';
    promise = apiRequest(`${environment.API_URL}${url}`);
  }
  return promise;
};

export { loadAppointment };
