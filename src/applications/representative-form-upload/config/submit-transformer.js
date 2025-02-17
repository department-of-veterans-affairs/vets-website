import sharedTransformForSubmit from '../../simple-forms/shared/config/submit-transformer';
import { getFormContent } from '../helpers';

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
