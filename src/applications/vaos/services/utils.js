import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const USE_MOCK_DATA =
  !window.Cypress &&
  environment.isLocalhost() &&
  !environment.API_URL.includes('review.vetsgov');

function vaosFHIRRequest(url, ...options) {
  return apiRequest(`${environment.API_URL}/vaos/v1/${url}`, ...options);
}

/**
 * Fetches a searchset from a FHIR endpoint in VAOS and returns an array of
 * resources
 *
 * @export
 * @param {String} params.query The FHIR resource and query string to fetch
 * @returns {Array} An array of FHIR resources (not necessarily all the same type as the resource in the query)
 */
export function fhirSearch({ query }) {
  return vaosFHIRRequest(query).then(
    resp => resp.entry?.map(item => item.resource) || [],
  );
}

/**
 * Maps the JSON API error format to the FHIR OperationOutcome format
 *
 * @export
 * @param {Array} errors A list of errors in JSON API format
 * @returns {Object} A FHIR OperationOutcome
 */
export function mapToFHIRErrors(errors) {
  return {
    resourceType: 'OperationOutcome',
    issue: errors.map(error => ({
      severity: 'error',
      code: error.code,
      diagnostics: error.title,
      details: {
        code: error.status,
        text: error.detail,
      },
    })),
  };
}

/*
 * Makes an api request using the standard helpers, but runs through the vaos mock handlers first
 */
export async function apiRequestWithMocks(url, options, ...rest) {
  /* istanbul ignore if  */
  if (USE_MOCK_DATA) {
    // This needs to be lazy loaded to keep it out of the main bundle
    const handlers = (await import(/* webpackChunkName: "mocks" */ './mocks'))
      .default;

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

export function parseApiList(resp) {
  return resp.data.map(item => ({ ...item.attributes, id: item.id }));
}

export function parseApiObject(resp) {
  return {
    ...resp.data.attributes,
    id: resp.data.id,
  };
}
