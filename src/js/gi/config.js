import environment from '../common/helpers/environment';

// Temporary hack to use GIDS on localhost directly
// (instead of vets-api)
function getAPIUrl(useLocalGidsURL) {
  const localGidsApiURL = 'https://dev-api.vets.gov/v0/gi'; // 'http://localhost:5000/v0';
  const it = useLocalGidsURL ? localGidsApiURL : `${environment.API_URL}/v0/gi`;
  return it;
}

module.exports = {
  // Base URL to be used in API requests.
  api: {
    url: getAPIUrl(true),
    settings: {
      headers: {
        'Content-Type': 'application/json',
        // 'X-Key-Inflection': 'camel',
      }
    }
  }
};
