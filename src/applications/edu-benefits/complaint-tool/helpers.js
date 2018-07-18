import environment from '../../../platform/utilities/environment';

export function transformAutocompletePayloadForAutosuggestField({ payload, error, searchTerm }) {
  if (payload) {
    return {
      options: payload
      .data
      .map(({ value, label }) => ({ value, label })),
      searchTerm
    };
  }
  return [];
}
export function fetchAutocompleteSuggestions(text, version) {
  const url = `${environment.API_URL}/v0/gi/institutions/autocomplete?term=${text}`;

  return fetch(url, {
    headers: {
      'X-Key-Inflection': 'camel'
    }
  })
    .then(res => res.json())
    .then(
      payload => ({
        payload,
        searchTerm: text
      }),
      error => { error }
    );
};
