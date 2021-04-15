import { optInErrorMessage } from './content/OptIn';

export const isValidDate = date => date instanceof Date && isFinite(date);

export const requireIssue = (err, fieldData /* , formData */) => {
  if (fieldData.length === 0) {
    err.addError('Please select one of the eligible issues or add an issue');
  }
};

export const optInValidation = (err, value) => {
  if (!value) {
    err.addError(optInErrorMessage);
  }
};
