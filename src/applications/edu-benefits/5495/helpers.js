import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
