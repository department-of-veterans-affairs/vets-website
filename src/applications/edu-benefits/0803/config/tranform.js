import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const data = transformForSubmit(form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: data,
    },
  });
}
