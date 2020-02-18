import { validateWhiteSpace } from 'platform/forms/validations';

const validateName = (errors, pageData) => {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
};

export { validateName };
