import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  // Stringifies the form data and removes empty fields
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
