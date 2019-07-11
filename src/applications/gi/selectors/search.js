import environment from 'platform/utilities/environment';

export const calculateFilters = filters => {
  if (!environment.isProduction()) {
    if (filters.category === 'ALL') {
      return {
        ...filters,
        category: 'school',
      };
    }

    if (filters.vet_tec_provider) {
      return {
        ...filters,
        category: 'vettec',
      };
    }
  }
  return filters;
};

export const calculateEligibility = eligibility => {
  if (!environment.isProduction() && eligibility.onlineClasses === 'none') {
    return {
      ...eligibility,
      onlineClasses: 'no',
    };
  }
  return eligibility;
};
