import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  /** @type {ReplacerOptions} */
  const options = { replaceEscapedCharacters: true };

  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form, options),
  );

  if (
    form.data.application.applicant.applicantRelationshipToClaimant === 'Self'
  ) {
    delete transformedData.application.applicant.name;
    delete transformedData.application.applicant.mailingAddress;
  }

  return JSON.stringify({
    ...transformedData,
    formNumber: formConfig.formId,
    version: 'int',
  });
}
