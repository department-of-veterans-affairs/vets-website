import appendQuery from 'append-query';
import { apiRequest } from '~/platform/utilities/api';
import STUBBED_RESPONSE from '../constants/stub.json';

export const fetchFormsApi = async (query, options = {}) => {
  const mockRequest = options?.mockRequest || false;

  // Change to https://dev-api.va.gov/v0/forms for quick local config
  let FORMS_URL = '/forms';
  let response = STUBBED_RESPONSE;

  if (query) {
    FORMS_URL = appendQuery(FORMS_URL, { query });
  }

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

  return {
    hasOnlyRetiredForms,
    results: onlyValidForms,
  };
};
