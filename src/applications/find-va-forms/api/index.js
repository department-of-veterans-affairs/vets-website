// Relative imports.
import mockForms from '../constants/example.json';
import { normalizeFormsForTable } from '../helpers';

// `fetchFormsApi` will need to be updated to make the request to api.va.gov once the endpoint is ready.
// fetch(`https://api.va.gov/find-va-forms?q=${query}`);
export const fetchFormsApi = (URL, query) => {
  const forms = mockForms.data.filter(form =>
    form.attributes.title?.toLowerCase().includes(query),
  );

  // Normalize the forms data we get back from the API resopnse.
  const normalizedForms = normalizeFormsForTable(forms);

  // Give back the normalized forms data.
  return normalizedForms;
};
