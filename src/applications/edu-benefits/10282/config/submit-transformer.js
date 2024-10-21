export function transform(formConfig, form) {
  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(form.data),
    },
  });
}
