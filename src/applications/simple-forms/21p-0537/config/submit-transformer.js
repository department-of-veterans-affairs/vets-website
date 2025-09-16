import { transformForSubmit as defaultTransformForSubmit } from 'platform/forms-system/src/js/helpers';

function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    defaultTransformForSubmit(formConfig, form),
  );

  // Helper function to format full name as string
  const formatFullName = nameObj => {
    if (!nameObj) return '';
    const { first = '', middle = '', last = '' } = nameObj;
    return [first, middle, last].filter(Boolean).join(' ');
  };

  return JSON.stringify({
    formNumber: formConfig.formId,
    veteran: {
      fullName: transformedData.veteranFullName,
      ssn: transformedData.veteranSocialSecurityNumber,
      vaFileNumber: transformedData.vaFileNumber,
    },
    recipient: {
      fullName: transformedData.recipientName,
      phone: transformedData.recipient?.phone || {},
      email: transformedData.recipient?.email,
      signature: formatFullName(transformedData.recipientName),
      signatureDate: new Date().toISOString().split('T')[0],
    },
    inReplyReferTo:
      transformedData.veteranSocialSecurityNumber ||
      transformedData.vaFileNumber,
    hasRemarried: transformedData.hasRemarried,
    marriageDate: transformedData.remarriage?.dateOfMarriage,
    spouseName: formatFullName(transformedData.remarriage?.spouseName),
    spouseDateOfBirth: transformedData.remarriage?.spouseDateOfBirth,
    spouseIsVeteran: transformedData.remarriage?.spouseIsVeteran,
    spouseVeteranId:
      transformedData.remarriage?.spouseVeteranId?.vaFileNumber ||
      transformedData.remarriage?.spouseVeteranId?.ssn,
    ageAtMarriage: transformedData.remarriage?.ageAtMarriage,
    hasTerminated: transformedData.remarriage?.hasTerminated,
    terminationDate: transformedData.remarriage?.terminationDate,
    terminationReason: transformedData.remarriage?.terminationReason,
  });
}

export default transformForSubmit;
