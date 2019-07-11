import environment from 'platform/utilities/environment';
import { INITIAL_STATE as defaultFilters } from '../reducers/filter';
import { INITIAL_STATE as defaultEligibility } from '../reducers/eligibility';

export const calculateFilters = filters => {
  if (!environment.isProduction() && filters.category === 'ALL') {
    return {
      ...filters,
      category: defaultFilters.category,
    };
  }
  return filters;
};

export const calculateEligibility = eligibility => {
  if (!environment.isProduction() && eligibility.onlineClasses === 'none') {
    return {
      ...eligibility,
      onlineClasses: defaultEligibility.onlineClasses,
    };
  }
  return eligibility;
};
