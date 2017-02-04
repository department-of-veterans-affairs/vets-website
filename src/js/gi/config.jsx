import environment from '../common/helpers/environment';

// Temporary hack to use GIDS on localhost directly
// (instead of vets-api)
function getAPIUrl(useLocalGidsURL) {
  const localGidsApiURL = 'http://localhost:5000';
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
      }
    }
  }
};
