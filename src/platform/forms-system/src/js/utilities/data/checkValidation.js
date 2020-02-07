import { reduceErrors } from './formatErrors';
import { isValidForm } from '../../validation';

/* Check/recheck form validation for error message updating */
export const checkValidation = ({
  form,
  formConfig,
  pageList,
  setFormErrors,
}) => {
  // Validation errors in this situation are not visible, so we’d
  // like to know if they’re common
  const { isValid, errors } = isValidForm(form, pageList);
  setFormErrors({
    rawErrors: errors,
    errors: reduceErrors(errors, formConfig),
  });
  return { isValid, errors };
};
