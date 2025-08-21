import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const baseData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form, {
      replaceEscapedCharacters: true,
    }),
  );

  const { fullName, dob, ...otherFields } = baseData;

  const payload = {
    form: {
      ...otherFields,
      veteranInformation: {
        fullName,
        dob,
      },
    },
  };

  return JSON.stringify(payload);
}
