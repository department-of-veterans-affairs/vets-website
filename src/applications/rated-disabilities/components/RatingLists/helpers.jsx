import { buildDateFormatter } from '../../util';

export const formatDate = buildDateFormatter();

export const getHeadingText = rating => {
  const { diagnosticText, ratingPercentage } = rating;
  const headingParts = [diagnosticText];
  if (ratingPercentage !== null && typeof ratingPercentage !== 'undefined') {
    headingParts.unshift(`${ratingPercentage}% rating for`);
  }

  return headingParts.join(' ');
};

// Possible decision values:
//   1151 Denied, 1151 Granted, Not Service Connected, Service Connected
// Decisions that should be considered Service Connected:
//   1151 Granted and Service Connected
const serviceConnectedDecisions = ['1151 Granted', 'Service Connected'];

const isServiceConnected = item =>
  serviceConnectedDecisions.includes(item.decision);

export const sortRatings = ratings => {
  return ratings.sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
};

export const getServiceConnectedRatings = ratings =>
  sortRatings(ratings.filter(isServiceConnected));

// Non-service-connected ratings will have an effectiveDate of null,
// so we don't need to sort them
export const getNonServiceConnectedRatings = ratings =>
  ratings.filter(rating => !isServiceConnected(rating));
