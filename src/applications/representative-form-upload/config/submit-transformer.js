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

export function transformForSubmit(formConfig, form) {
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
    vaFileNumber,
  } = transformedData;
  const { confirmationCode } = transformedData.uploadedFile;

  return JSON.stringify({
    confirmationCode,
    formName: subTitle,
    supportingDocuments: transformedData.supportingDocuments,
    formData: {
      veteranSsn,
      postalCode: address.postalCode,
      veteranFullName,
      veteranDateOfBirth,
      formNumber,
      claimantFullName,
      claimantDateOfBirth,
      claimantSsn,
      vaFileNumber,
    },
  });
}

export function itfTransformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );

  const { formNumber } = getFormContent();

  const {
    veteranSubPage: {
      veteranSsn = {},
      address = {},
      veteranFullName = {},
      veteranDateOfBirth = {},
      vaFileNumber,
    } = {},
    claimantSubPage: {
      claimantFullName = {},
      claimantDateOfBirth,
      claimantSsn,
    } = {},
    benefitType,
    isVeteran,
  } = transformedData;

  return JSON.stringify({
    veteranSsn,
    postalCode: address.postalCode,
    veteranFullName,
    veteranDateOfBirth,
    formNumber,
    claimantFullName,
    claimantDateOfBirth,
    claimantSsn,
    vaFileNumber,
    benefitType: isVeteran === 'no' ? 'survivor' : benefitType,
  });
}
