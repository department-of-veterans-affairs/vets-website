import { LOAN_NUMBER_DIGIT_LENGTH } from './constants';
import { replaceNonDigits } from './config/helpers';
import text from './content/loanHistory';

export const validateDocumentDescription = (errors, fileList) => {
  fileList.forEach((file, index) => {
    const error =
      file.attachmentType === 'Other' && !file.attachmentDescription
        ? 'Provide a description'
        : null;
    if (error && !errors[index]) {
      /* eslint-disable no-param-reassign */
      errors[index] = {
        attachmentDescription: {
          __errors: [],
          addError(msg) {
            this.__errors.push(msg);
          },
        },
      };
      /* eslint-enable no-param-reassign */
    }
    if (error) {
      errors[index].attachmentDescription.addError(error);
    }
  });
};

export const validateUniqueVALoanNumber = (errors, data) => {
  const loans = (data || [])
    .map(loan => replaceNonDigits(loan?.vaLoanNumber || ''))
    .filter(Boolean);
  const unique = new Set(loans);
  if (loans.length && loans.length !== unique.size) {
    loans.forEach((loan, index) => {
      const indx = loans.findIndex(number => number === loan);
      if (indx !== index) {
        errors[index].vaLoanNumber.addError(text.loanNumber.unique);
        errors[indx].vaLoanNumber.addError(text.loanNumber.unique);
      }
    });
  }
};

export const validateVALoanNumber = (errors, loanNumber) => {
  const number = replaceNonDigits(loanNumber || '');

  if (number.length !== LOAN_NUMBER_DIGIT_LENGTH) {
    errors.addError(text.loanNumber.lengthError);
  }
};
