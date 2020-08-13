import _ from 'lodash';

export const searchWithFilters = (props, additionalFields = []) => {
  // Translate form selections to query params.
  const query = {
    ...props.location.query,
  };

  additionalFields.forEach(({ field, value }) => {
    query[field] = value;
  });

  if (query.name === undefined) {
    query.name = props.autocomplete.searchTerm;
  }

  // Don’t update the route if the query hasn’t changed.
  if (_.isEqual(query, props.location.query) || props.search.inProgress) {
    return;
  }
  props.clearAutocompleteSuggestions();

  // Reset to the first page upon a filter change.
  delete query.page;

  additionalFields.forEach(({ field, value }) => {
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
  });

  props.router.push({ ...props.location, query });
};
