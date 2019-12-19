// Dependencies.
import appendQuery from 'append-query';
import { orderBy } from 'lodash';
// Relative imports.
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeFormsForTable } from '../helpers';

export const fetchFormsApi = async query => {
  let FORMS_URL = '/forms';

  // Add the `query` query param if provided.
  if (query) {
    FORMS_URL = appendQuery(FORMS_URL, { query });
  }

  // Make the request for the forms.
  const response = await apiRequest(FORMS_URL);

  // Derive the forms.
  const forms = response?.data;

  // Give back the normalized forms data.
  const normalizedForms = normalizeFormsForTable(forms);

  // Sort the forms by 'id' and 'asc' by default.
  const sortedForms = orderBy(normalizedForms, 'id', 'asc');

  return sortedForms;
};
