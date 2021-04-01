import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
