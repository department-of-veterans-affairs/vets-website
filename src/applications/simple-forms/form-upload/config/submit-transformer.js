import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { getFormContent } from '../helpers';

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber } = getFormContent();
  const { idNumber = {}, address = {}, veteran = {}, email } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formNumber,
    formData: {
      idNumber,
      postalCode: address.postalCode,
      fullName: veteran.fullName,
      email,
    },
  });
};

export default transformForSubmit;
