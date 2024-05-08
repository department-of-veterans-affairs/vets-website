import { startOfDay, subYears, isBefore } from 'date-fns';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getFullNameLabels(label, skipMiddleCheck = false) {
  if (label === 'middle name' && !skipMiddleCheck) {
    return 'Middle initial';
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function validateLivingSituation(errors, fields) {
  const selectedSituations = Object.keys(fields.livingSituation).filter(
    key => fields.livingSituation[key],
  );

  // We're just checking to make sure no other option's selected along with NONE here
  // schema's required prop already handles required error-message
  if (selectedSituations.length > 1 && selectedSituations.includes('NONE')) {
    errors.livingSituation.addError(
      `If none of these situations apply to you, unselect the other options you selected`,
    );
  }
}

export const isEligibleForDecisionReview = decisionDate => {
  if (!decisionDate) return false;
  const oneYearAgo = startOfDay(subYears(new Date(), 1));
  const decisionDateTime = startOfDay(new Date(decisionDate.split('-')));
  return isBefore(oneYearAgo, decisionDateTime);
};
