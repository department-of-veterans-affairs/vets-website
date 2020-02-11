import { reduceErrors } from './reduceErrors';
import { isValidForm } from '../../validation';

/* Check/recheck form validation for error message updating */
export const checkValidation = ({
  form,
  formConfig,
  pageList,
  setFormErrors,
}) => {
  const { isValid, errors } = isValidForm(form, pageList);
  setFormErrors({
    rawErrors: errors,
    errors: reduceErrors(errors, formConfig),
  });
  return { isValid, errors };
};
