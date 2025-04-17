import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { getFormContent } from '../helpers';

function sharedTransformForSubmit(formConfig, form, options) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form, {
      ...options,
      replaceEscapedCharacters: true,
    }),
  );

  return JSON.stringify({ ...transformedData, formNumber: formConfig.formId });
}

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber, subTitle } = getFormContent();
  const {
    veteranSsn = {},
    address = {},
    veteranFullName = {},
    veteranDateOfBirth = {},
    claimantFullName = {},
    claimantDateOfBirth,
    claimantSsn,
    email,
  } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formName: subTitle,
    formData: {
      veteranSsn,
      postalCode: address.postalCode,
      veteranFullName,
      veteranDateOfBirth,
      formNumber,
      email,
      claimantFullName,
      claimantDateOfBirth,
      claimantSsn,
    },
  });
};

export default transformForSubmit;
