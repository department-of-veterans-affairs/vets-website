import sharedTransformForSubmit from '../../../simple-forms/shared/config/submit-transformer';
import { getFormContent } from '../helpers';

// import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

/**
 * Example:
 * ```
 * transformForSubmit(formConfig, form);
 * transformForSubmit(formConfig, form, {
 *   allowPartialAddress: true,
 * });
 * ```
 *
 * @param formConfig
 * @param form
 * @param [options]
 */

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber, subTitle } = getFormContent();
  const { idNumber = {}, address = {}, fullName = {}, email } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formNumber,
    formName: subTitle,
    formData: {
      idNumber,
      postalCode: address.postalCode,
      fullName,
      email,
    },
  });
};

export default transformForSubmit;
