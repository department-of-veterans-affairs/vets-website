/**
 * @module services/utils
 */

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
 * @param {Object} params
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
export function mapToFHIRErrors(errors, title = null) {
  return {
    resourceType: 'OperationOutcome',
    issue: errors.map(error => ({
      severity: 'error',
      code: error.code,
      diagnostics: error.title || title,
      source: error.source,
      details: {
        code: error.status || error.code,
        text: error.detail || error.summary,
      },
    })),
  };
}

/**
 * Makes an api request using the standard vets-website fetch helpers, but runs through the vaos mock handlers first
 *
 * @export
 * @param {string} url The url of the api request
 * @param {Object} options The options object passed to the fetch call
 * @param {...*} rest Remaining parameters passed through to apiRequest helper
 * @returns {Promise} Either the promise returned by apiRequest, or a promise with mock data as the result
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

/**
 * Parses our standard list of data response structure into an array
 *
 * @export
 * @param {Object} resp Response object with a data array property
 * @returns {Array} An array of the attributes object of each item in data, combined with the id
 */
export function parseApiList(resp) {
  return resp.data.map(item => ({ ...item.attributes, id: item.id }));
}

/**
 * Parses our standard list of data response structure into an array while
 * also including any errors included
 *
 * @export
 * @param {Object} resp Response object with a data array property
 * @returns {Object} An object with a data array of the attributes object of each item in data,
 *    combined with the id and an errors array of the errors returned
 */
export function parseApiListWithErrors(resp) {
  return {
    data: resp.data.map(item => ({ ...item.attributes, id: item.id })),
    errors: resp.meta?.errors,
  };
}

/**
 * Parses a single item response and returns the attributes object that contains
 * the actual data
 *
 * @export
 * @param {Object} resp Response object with a single object data property
 * @returns {Object} The data.attributes object from resp, but with the id included
 */
export function parseApiObject(resp) {
  return {
    ...resp.data.attributes,
    id: resp.data.id,
  };
}
