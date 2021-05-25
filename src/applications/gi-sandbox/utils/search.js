import URLSearchParams from 'url-search-params';

export const searchWithFilters = ({
  pathname,
  search,
  field,
  value,
  query,
  history,
}) => {
  const queryParams = new URLSearchParams(query);
  if (!search.inProgress && queryParams.get(field) !== value) {
    const removedWhenAllFields = ['country', 'state', 'type'];
    queryParams.delete('page');

    if (!value || (removedWhenAllFields.includes(field) && value === 'ALL')) {
      queryParams.delete(field);
    } else {
      queryParams.set(field, value);
    }

    if (queryParams.toString() !== query) {
      history.push({ pathname, search: queryParams.toString() });
    }
  }
};
