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

  // Determine the active flow
  const isApplicantFlow = formConfig.flow === 'applicant'; // or use a similar condition

  // Remove duplicate data based on the active flow
  if (isApplicantFlow) {
    // In applicant flow, remove unnecessary claimant data
    delete transformedData.application.claimant;
  } else {
    // In claimant flow, remove unnecessary applicant data
    delete transformedData.application.applicant;
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
