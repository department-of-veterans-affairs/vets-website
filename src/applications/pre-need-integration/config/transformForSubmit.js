import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return value
      .replaceAll('"', "'")
      .replace(/(?:\r\n|\n\n|\r|\n)/g, '; ')
      .replace(/(?:\t|\f|\b)/g, '')
      .replace(/\\(?!(f|n|r|t|[u,U][\d,a-fA-F]{4}))/gm, '/');
  }

  return value;
};

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  if (
    form.data.application.applicant.applicantRelationshipToClaimant === 'Self'
  ) {
    delete transformedData.application.applicant.name;
    delete transformedData.application.applicant.mailingAddress;
  }

  if (
    form.data.application.applicant.applicantRelationshipToClaimant ===
    'Authorized Agent/Rep'
  ) {
    delete transformedData.application.applicant.name;
    delete transformedData.application.applicant.mailingAddress;
    delete transformedData.application.applicant.ssn;
    delete transformedData.application.applicant.dateOfBirth;
  }

  return JSON.stringify(
    {
      ...transformedData,
      formNumber: formConfig.formId,
      version: 'int',
    },
    escapedCharacterReplacer,
  );
}
