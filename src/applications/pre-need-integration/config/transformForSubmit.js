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

  console.log(transformedData.application.applicant.mailingAddress);

  const isApplicantFlow = formConfig.flow === 'applicant';

  if (isApplicantFlow) {
    // In applicant flow, remove only the specific claimant data from prefillTransformer
    if (transformedData.application.claimant) {
      delete transformedData.application.claimant.name;
      delete transformedData.application.claimant.address;
      delete transformedData.application.claimant.ssn;
      delete transformedData.application.claimant.dateOfBirth;
    }
  } else {
    // In claimant (veteran) flow, remove only the specific applicant data from prefillTransformer
    if (transformedData.application.applicant) {
      delete transformedData.application.applicant.name;
      delete transformedData.application.applicant.mailingAddress; //HERE
    }
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
