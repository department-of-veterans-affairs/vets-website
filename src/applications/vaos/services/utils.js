/**
 * @module services/utils
 */

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from 'platform/utilities/api';

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
 * Makes an api request using the standard vets-website fetch helpers, but prefixes
 * the url with the current api path
 *
 * @export
 * @param {string} url The url of the api request
 * @param {Object} options The options object passed to the fetch call
 * @param {...*} rest Remaining parameters passed through to apiRequest helper
 * @returns {Promise} The promise returned by apiRequest
 */
export async function apiRequestWithUrl(url, options, ...rest) {
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
 *    combined with the id, an errors array of the errors and an array of failures is returned.
 */
export function parseApiListWithErrors(resp) {
  return {
    data: resp.data.map(item => ({
      ...item.attributes,
      id: item.id,
    })),
    errors: resp.meta?.errors,
    backendSystemFailures: resp.meta?.failures,
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
