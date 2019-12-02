// Relative imports.
import mockForms from '../constants/example.json';

// `fetchFormsApi` will need to be updated to make the request to api.va.gov once the endpoint is ready.
// fetch(`https://api.va.gov/find-va-forms?q=${query}`);
export const fetchFormsApi = async (URL, query) => {
  const filteredData = mockForms.data.filter(form =>
    form.attributes.title?.toLowerCase().includes(query),
  );

  const forms = {
    data: filteredData,
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Give back the normalized forms data.
  return forms;
};
