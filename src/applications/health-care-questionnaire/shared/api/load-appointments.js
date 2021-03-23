import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA = window.Cypress; // || environment.isLocalhost() || environment.isStaging();

const loadAppointment = async id => {
  let promise;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import(/* webpackChunkName: "appointment-data" */ './mock-data/fhir/data.json').then(
          module => {
            const questionnaire = module.default.data.filter(
              f => f.appointment.id === id,
            )[0];
            if (questionnaire) {
              resolve(questionnaire.appointment);
            } else {
              resolve(module.default.data[0].appointment);
            }
          },
        );
      }, 0);
    });
  } else {
    const url = `/health_quest/v0/appointments/${id}`;
    promise = apiRequest(`${environment.API_URL}${url}`);
  }
  return promise;
};

export { loadAppointment };
