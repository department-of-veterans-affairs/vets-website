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
  // eslint-disable-next-line no-param-reassign
  form.data.application.veteran.serviceRecords = form.data.serviceRecords;
  // eslint-disable-next-line no-param-reassign
  delete form.data.serviceRecords;
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  if (
    form.data.application.applicant.applicantRelationshipToClaimant === 'Self'
  ) {
    delete transformedData.application.applicant.name;
    delete transformedData.application.applicant.mailingAddress;
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
