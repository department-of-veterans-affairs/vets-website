import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';
import { replaceEscapedCharacters } from 'platform/forms-system/src/js/utilities/replaceEscapedCharacters';

const escapedCharacterReplacer = (_key, value) => {
  if (typeof value === 'string') {
    return replaceEscapedCharacters(value);
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

  return JSON.stringify(
    {
      ...transformedData,
      formNumber: formConfig.formId,
      version: 'int',
    },
    escapedCharacterReplacer,
  );
}
