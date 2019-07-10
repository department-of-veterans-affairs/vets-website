const calculateFilters = filters => {
  if (filters.category === 'ALL') {
    return {
      ...filters,
      category: 'school',
    };
  }
  return filters;
};

export { calculateFilters };
