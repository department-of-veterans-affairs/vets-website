export const validateApplicantName = (errors, value) => {
  if (value.first && value.first.trim().length === 0) {
    errors.first.addError('Please provide a response');
  }

  if (value.last && value.last.trim().length === 0) {
    errors.last.addError('Please provide a response');
  }
};
