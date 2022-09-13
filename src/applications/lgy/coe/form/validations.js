import { LOAN_NUMBER_DIGIT_LENGTH } from './constants';
import { replaceNonDigits } from './config/helpers';
import text from './content/loanHistory';

export const validateDocumentDescription = (errors, fileList) => {
  fileList.forEach((file, index) => {
    const error =
      file.attachmentType === 'Other' && !file.attachmentDescription
        ? 'Please provide a description'
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

export const validateVALoanNumber = (errors, loanNumber) => {
  const number = replaceNonDigits(loanNumber || '');

  if (number.length !== LOAN_NUMBER_DIGIT_LENGTH) {
    errors.addError(text.loanNumber.lengthError);
  }
};
