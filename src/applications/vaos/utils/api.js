import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA =
  !window.Cypress &&
  environment.isLocalhost() &&
  !environment.API_URL.includes('review.vetsgov');

export default async function apiRequestWithMocks(url, options, ...rest) {
  /* istanbul ignore if  */
  if (USE_MOCK_DATA) {
    // This needs to be lazy loaded to keep it out of the main bundle
    const handlers = (await import('../api/handlers')).default;

    // find a matching handler by method and path checks
    const match = handlers.find(handler => {
      return (
        options?.method === handler.method &&
        (typeof handler.path === 'string'
          ? url.endsWith(handler.path)
          : handler.path.test(url))
      );
    });

    if (match) {
      // eslint-disable-next-line no-console
      console.log(`VAOS mock request: ${options?.method || 'GET'} ${url}`);

      // Sometimes it's useful to grab ids or other data from the url, so
      // this passes through matched regex groups
      let groups = [];
      if (match.path instanceof RegExp) {
        groups = match.path.exec(url).slice(1);
      }

      const response =
        typeof match.response === 'function'
          ? match.response(url, {
              requestData: options?.body ? JSON.parse(options.body) : null,
              groups,
            })
          : match.response;

      return new Promise(resolve => {
        setTimeout(() => resolve(response), match.delay || 150);
      });
    }
  }

  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
}
