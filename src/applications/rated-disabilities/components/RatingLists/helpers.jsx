import { buildDateFormatter } from '../../util';

export const formatDate = buildDateFormatter('MMMM dd, yyyy');

export const getHeadingText = rating => {
  const { diagnosticText, ratingPercentage } = rating;
  const headingParts = [diagnosticText];
  if (ratingPercentage !== null && typeof ratingPercentage !== 'undefined') {
    headingParts.unshift(`${ratingPercentage}% rating for`);
  }

  return headingParts.join(' ');
};

const isServiceConnected = item => item.decision === 'Service Connected';

export const sortRatings = ratings => {
  return ratings.sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
};

export const getServiceConnectedRatings = ratings =>
  sortRatings(ratings.filter(isServiceConnected));

// Non-service-connected ratings will have an effectiveDate of null,
// so we don't need to sort them
export const getNonServiceConnectedRatings = ratings =>
  ratings.filter(rating => !isServiceConnected(rating));
