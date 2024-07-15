import sharedTransformForSubmit from '../../shared/config/submit-transformer';

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { ssn, vaFileNumber, zipCode, uploadedFile } = transformedData;

  return JSON.stringify({
    confirmationCode: uploadedFile?.confirmationCode,
    formNumber: '21-0779',
    options: { ssn, vaFileNumber, zipCode },
  });
};

export default transformForSubmit;
