// Dependencies.
import appendQuery from 'append-query';
import sortBy from 'lodash/sortBy';
import { apiRequest } from 'platform/utilities/api';
// Relative imports.
import STUBBED_RESPONSE from '../constants/STUBBED_RESPONSE';

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
  const sortedForms = sortBy(forms, 'id');

  return sortedForms;
};
