import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import { getFormContent } from '../helpers';

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber, subTitle } = getFormContent();
  const {
    idNumber = {},
    address = {},
    fullName = {},
    email,
    supportingDocuments,
  } = transformedData;
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
    ...(Array.isArray(supportingDocuments) && {
      supportingDocuments: supportingDocuments.map(doc => ({
        confirmationCode: doc.confirmationCode,
      })),
    }),
  });
};

export default transformForSubmit;
