import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA =
  environment.isLocalhost() && !environment.API_URL.includes('review.vetsgov');

function vaosFHIRRequest(url, ...options) {
  return apiRequest(`${environment.API_URL}/vaos/v1/${url}`, ...options);
}

/**
 * Fetches a searchset from a FHIR endpoint in VAOS and returns an array of
 * resources
 *
 * @export
 * @param {String} params.query The FHIR resource and query string to fetch
 * @param {Function} params.mock A function that returns a promise containing mock data to use
 * @returns {Array} An array of FHIR resources (not necessarily all the same type as the resource in the query)
 */
export function fhirSearch({ query, mock }) {
  let promise = null;
  if (USE_MOCK_DATA) {
    promise = new Promise(resolve =>
      setTimeout(() => {
        mock().then(module => {
          resolve(module.default ? module.default : module);
        });
      }, 500),
    );
  } else {
    promise = vaosFHIRRequest(query);
  }

  return promise.then(resp => resp.entry.map(item => item.resource));
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
