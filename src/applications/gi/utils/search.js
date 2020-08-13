import _ from 'lodash';

export const searchWithFilters = (props, params = [], removedFields = []) => {
  if (props.search.inProgress) {
    return;
  }

  // Translate form selections to query params.
  const query = {
    ...props.location.query,
  };

  params.forEach(({ field, value }) => {
    query[field] = value;
  });

  if (query.name === undefined) {
    query.name = props.autocomplete.searchTerm;
  }

  // Don’t update the route if the query hasn’t changed.
  if (_.isEqual(query, props.location.query)) {
    return;
  }

  props.clearAutocompleteSuggestions();

  // Reset to the first page upon a filter change.
  delete query.page;

  params.forEach(({ field, value }) => {
    const shouldRemoveFilter =
      !value || (removedFields.includes(field) && value === 'ALL');

    if (shouldRemoveFilter) {
      delete query[field];
    }
  });

  props.router.push({ ...props.location, query });
};
