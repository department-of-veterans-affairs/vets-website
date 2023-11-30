const isServiceConnected = item => item.decision === 'Service Connected';

export const sortRatings = ratings =>
  ratings.sort((a, b) => a.effectiveDate < b.effectiveDate);

export const getServiceConnectedRatings = ratings =>
  sortRatings(ratings.filter(isServiceConnected));

export const getNonServiceConnectedRatings = ratings =>
  sortRatings(ratings.filter(rating => !isServiceConnected(rating)));
