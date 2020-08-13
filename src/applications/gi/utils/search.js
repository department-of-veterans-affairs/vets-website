import _ from 'lodash';

export const searchWithFilters = (
  props,
  field,
  value,
  additionalFields = [],
) => {
  // Translate form selections to query params.
  const query = {
    ...props.location.query,
    [field]: value,
    name: value === undefined ? field : props.autocomplete.searchTerm,
  };
  // Don’t update the route if the query hasn’t changed.
  if (_.isEqual(query, props.location.query) || props.search.inProgress) {
    return;
  }
  props.clearAutocompleteSuggestions();

  // Reset to the first page upon a filter change.
  delete query.page;

  const shouldRemoveFilter =
    !value ||
    ((field === 'country' ||
      field === 'state' ||
      field === 'type' ||
      field === 'relaffil') &&
      value === 'ALL');

  if (shouldRemoveFilter) {
    delete query[field];
  }

  props.router.push({ ...props.location, query });
};
