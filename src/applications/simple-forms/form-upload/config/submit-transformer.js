import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { getFormContent } from '../helpers';

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber } = getFormContent();
  const { idNumber = {}, address = {} } = transformedData.veteran;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formNumber,
    options: {
      ssn: idNumber.ssn,
      vaFileNumber: idNumber.vaFileNumber,
      zipCode: address.postalCode,
    },
  });
};

export default transformForSubmit;
