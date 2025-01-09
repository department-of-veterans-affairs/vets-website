import _ from 'lodash';

export function transform(formConfig, form) {
  const newForm = _.cloneDeep(form.data);
  delete newForm.AGREED;
  delete newForm.signature;
  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(newForm),
    },
  });
}
