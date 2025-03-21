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
  const { idNumber = {}, address = {}, fullName = {}, email } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formNumber,
    formData: {
      idNumber,
      postalCode: address.postalCode,
      fullName,
      email,
      formName: subTitle,
    },
  });
};

export default transformForSubmit;
