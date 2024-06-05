import { startOfDay, subYears, isBefore } from 'date-fns';
import { setData } from 'platform/forms-system/src/js/actions';
import { apiRequest } from 'platform/utilities/api';
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

export function validateLivingSituationSelection(errors, fields) {
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

export function validateOtherReasonsSelection(errors, fields) {
  const selectedSituations = Object.keys(fields.otherReasons).filter(
    key => fields.otherReasons[key],
  );

  // We're just checking to make sure no other option's selected along with NONE here
  // schema's required prop already handles required error-message
  if (selectedSituations.length > 1 && selectedSituations.includes('NONE')) {
    errors.otherReasons.addError(
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

export const isIneligibleForPriorityProcessing = formData => {
  return (
    formData.statementType === STATEMENT_TYPES.PRIORITY_PROCESSING &&
    (formData.livingSituation.NONE && formData.otherReasons?.NONE)
  );
};

export const isEligibleToSubmitStatement = formData => {
  return (
    formData.statementType === STATEMENT_TYPES.NOT_LISTED ||
    isIneligibleForPriorityProcessing(formData)
  );
};

const upperizeKeys = obj => {
  if (!obj || obj.length === 0) return {};

  return Object.keys(obj).reduce((acc, k) => {
    const modifiedKey = k
      .split(/(?=[A-Z])/)
      .join('_')
      .toUpperCase();
    acc[modifiedKey] = obj[k];
    return acc;
  }, {});
};

export const fetchFormData = async (dispatch, form) => {
  try {
    const response = await apiRequest('/in_progress_forms/20-10207');
    const formData = response?.formData;

    if (formData) {
      const { livingSituation, otherReasons, otherHousingRisks } = formData;

      const existingData = form?.data || {};
      const formAlreadyStarted =
        existingData.livingSituation ||
        existingData.otherReasons ||
        existingData.otherHousingRisks;

      if (formAlreadyStarted) return;

      const updatedFormData = {
        ...existingData,
        livingSituation: upperizeKeys(livingSituation),
        otherReasons: upperizeKeys(otherReasons),
        otherHousingRisks,
      };
      dispatch(setData(updatedFormData));
    }
  } catch (error) {
    // Handle error if necessary
  } finally {
    // Optional cleanup or final steps
  }
};
