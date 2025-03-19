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
  // console.log(form)
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  // console.log("--------")
  // console.log(transformedData)
  const { formNumber, subTitle } = getFormContent();
  const {
    veteranSsn = {},
    address = {},
    veteranFullName = {},
    email,
    veteranDateOfBirth,
    claimantDateOfBirth,
    claimantFullName,
    claimantSsn,
  } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formNumber,
    formName: subTitle,
    formData: {
      veteranSsn,
      postalCode: address.postalCode,
      veteranFullName,
      email,
      veteranDateOfBirth,
      claimantDateOfBirth,
      claimantFullName,
      claimantSsn,
    },
  });
};

export default transformForSubmit;
