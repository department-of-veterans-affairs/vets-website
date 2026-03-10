import { startOfDay, subYears, isBefore } from 'date-fns';
import { STATEMENT_TYPES } from './config/constants';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getFullNameLabels(label, skipMiddleCheck = false) {
  if (label === 'middle name' && !skipMiddleCheck) {
    return 'Middle initial';
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export const isEligibleForDecisionReview = decisionDate => {
  if (!decisionDate) return false;
  const oneYearAgo = startOfDay(subYears(new Date(), 1));
  const decisionDateTime = startOfDay(new Date(decisionDate.split('-')));
  return isBefore(oneYearAgo, decisionDateTime);
};

export const isUserVeteran = formData =>
  formData?.['view:userIsVeteran'] === true;

export const isClaimantVeteran = formData =>
  formData?.claimantType === 'self' || formData?.claimantType === 'veteranSelf';

export const isNonVeteranClaimant = formData =>
  [
    'forVeteran',
    'anotherVeteran',
    'familyMember',
    'familyMemberOtherVeteran',
  ].includes(formData?.claimantType);

export const isEligibleToSubmitStatement = formData => {
  if (!formData?.statementType) {
    return true;
  }

  if (
    formData.statementType === STATEMENT_TYPES.NEW_EVIDENCE &&
    !isUserVeteran(formData)
  ) {
    return true;
  }

  return [
    STATEMENT_TYPES.NOT_LISTED,
    STATEMENT_TYPES.PRIORITY_PROCESSING,
  ].includes(formData.statementType);
};
