// import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA =
  environment.isLocalhost() && !environment.API_URL.includes('review.vetsgov');

const loadAppointment = async () => {
  let promise;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        import('./appointment-data.json').then(module => {
          resolve(module.default);
        });
      }, 3000);
    });
  } else {
    // console.log('using real data');
  }
  return promise;
};

export { loadAppointment };
