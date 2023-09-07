import { SELECTED } from '../constants';

export const validateRequireRatedDisability = (
  errors = {},
  fieldData,
  errorMsgs,
) => {
  if (!fieldData.some(entry => entry[SELECTED])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    errors.addError?.(errorMsgs.contestedIssue);
  }
};
