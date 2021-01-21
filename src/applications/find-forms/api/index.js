// Dependencies.
import * as Sentry from '@sentry/browser';
import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
// Relative imports.
import STUBBED_RESPONSE from '../constants/stub.json';

export const fetchFormsApi = async (query, options = {}) => {
  // Derive options properties.
  const mockRequest = options?.mockRequest || false;

  // Change to https://dev-api.va.gov/v0/forms for quick local config
  let FORMS_URL = '/forms';
  let response = STUBBED_RESPONSE;

  // Add the `query` query param if provided.
  if (query) {
    FORMS_URL = appendQuery(FORMS_URL, { query });
  }

  // Make the request for the forms.
  if (!mockRequest) {
    response = await apiRequest(FORMS_URL);
  }

  const forms = response?.data;
  const onlyValidForms = forms?.filter(
    form =>
      (form.attributes?.validPDF || form.attributes?.validPdf) &&
      (form.attributes?.deletedAt === null ||
        form.attributes?.deletedAt === undefined ||
        form.attributes?.deletedAt.length === 0),
  );

  // checks to see if all the forms in the results have been tombstone/ deleted.
  const hasOnlyRetiredForms = forms?.length > 0 && onlyValidForms?.length === 0;

  const potentialServerIssue =
    (query === '' || query === '10-10ez') && onlyValidForms?.length === 0;

  if (potentialServerIssue) {
    // A query-less search should always include hundreds of results, and a
    // search for "10-10ez" should always yield helath care form 10-10EZ.
    // If there are no results, this is likely an indicator of an unexpected server response.

    Sentry.withScope(scope => {
      scope.setExtra('query', query);
      scope.setExtra('forms', forms);
      Sentry.captureMessage(`Find Forms - unexpected empty results`);
    });
  }

  return {
    hasOnlyRetiredForms,
    results: onlyValidForms,
  };
};
