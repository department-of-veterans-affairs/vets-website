// Dependencies.
import appendQuery from 'append-query';
import sortBy from 'lodash/sortBy';
// Relative imports.
import STUBBED_RESPONSE from '../constants/STUBBED_RESPONSE';
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeFormsForTable } from '../helpers';

export const fetchFormsApi = async (query, options = {}) => {
  // Derive options properties.
  const mockRequest = options?.mockRequest || false;

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

  // Derive the forms.
  const forms = response?.data;

  // Give back the normalized forms data.
  const normalizedForms = normalizeFormsForTable(forms);

  // Sort the forms by 'id' and 'asc' by default.
  const sortedForms = sortBy(normalizedForms, 'id');

  return sortedForms;
};
