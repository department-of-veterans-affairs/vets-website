import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  let formData = JSON.parse(transformForSubmit(formConfig, form));

  if (form.data['view:phoneAndEmail']) {
    const { dayTimePhone, nightTimePhone, emailAddress } = form.data[
      'view:phoneAndEmail'
    ];

    formData = {
      ...formData,
      dayTimePhone,
      nightTimePhone,
      emailAddress,
    };
  }

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(formData),
    },
  });
}
