import environment from 'platform/utilities/environment';

const calculateFilters = filters => {
  if (!environment.isProduction() && filters.category === 'ALL') {
    return {
      ...filters,
      category: 'school',
    };
  }
  return filters;
};

export { calculateFilters };
