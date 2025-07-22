import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const baseData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form, {
      replaceEscapedCharacters: true,
    }),
  );

  const normalizedData = Object.entries(baseData).reduce(
    (acc, [key, value]) => {
      acc[key] =
        typeof value === 'string' && key.toLowerCase().includes('phone')
          ? value.replace(/-/g, '')
          : value;
      return acc;
    },
    {},
  );

  const { fullName, dob, internationalPhone, ...otherFields } = normalizedData;

  const payload = {
    ...otherFields,
    veteranInformation: {
      fullName,
      dob,
    },
  };

  if (internationalPhone.contact) {
    payload.internationalPhone = `${internationalPhone.callingCode}${
      internationalPhone.contact
    }`;
  }
  
  delete payload.checkBoxGroup;

  return JSON.stringify({
    veteranReadinessEmploymentClaim: {
      form: JSON.stringify(payload),
    },
  });
}
