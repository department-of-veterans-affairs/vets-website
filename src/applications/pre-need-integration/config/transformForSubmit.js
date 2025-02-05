import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const formCopy = {
    ...form,
    data: {
      ...form.data,
      application: {
        ...form.data.application,
        veteran: {
          ...form.data.application.veteran,
          serviceRecords: form.data.serviceRecords,
        },
      },
    },
  };
  delete formCopy.data.serviceRecords;

  /** @type {ReplacerOptions} */
  const options = { replaceEscapedCharacters: true };

  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, formCopy, options),
  );
  if (
    formCopy.data.application.applicant.applicantRelationshipToClaimant ===
    'Self'
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
