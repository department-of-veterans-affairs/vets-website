import environment from '../common/helpers/environment';

module.exports = {
  // Base URL to be used in API requests.
  api: {
    url: `${environment.API_URL}/v0/facilities/va`,
    settings: {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },
};
