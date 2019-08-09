export const calculateFilters = filters => {
  if (filters.category === 'ALL') {
    return {
      ...filters,
      category: 'school',
    };
  }

  if (filters.vetTecProvider) {
    return {
      ...filters,
      category: 'vettec',
    };
  }

  return filters;
};
