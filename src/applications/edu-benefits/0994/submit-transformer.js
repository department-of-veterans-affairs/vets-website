import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  let formData = transformForSubmit(formConfig, form);

  const phoneAndEmail = form.data['view:phoneAndEmail'];

  formData = {
    ...formData,
    dayTimePhone: phoneAndEmail.dayTimePhone,
    nightTimePhone: phoneAndEmail.nightTimePhone,
    emailAddress: phoneAndEmail.emailAddress,
  };

  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
