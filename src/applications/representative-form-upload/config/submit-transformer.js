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
};

export function itfTransformForSubmit(formConfig, form) {
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
    benefitType,
  } = transformedData;

  return JSON.stringify({
    formName: subTitle,
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
      benefitType,
    },
  });
}

export default transformForSubmit;
