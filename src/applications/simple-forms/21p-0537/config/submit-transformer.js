import { transformForSubmit as defaultTransformForSubmit } from 'platform/forms-system/src/js/helpers';

function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    defaultTransformForSubmit(formConfig, form),
  );

  return JSON.stringify({
    formNumber: formConfig.formId,
    veteran: {
      ssn: transformedData.recipient?.ssnOrVaFileNumber?.ssn,
      vaFileNumber: transformedData.recipient?.ssnOrVaFileNumber?.vaFileNumber,
    },
    hasRemarried: transformedData.hasRemarried,
    remarriage: transformedData.remarriage || {},
    recipient: {
      ...transformedData.recipient,
      signature: transformedData.recipient?.signature,
      signatureDate: transformedData.recipient?.signatureDate,
    },
    certification: transformedData.certification,
  });
}

export default transformForSubmit;
