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
