import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const newForm = cloneDeep(form);
  //
  // Need to add in Total enrolled FTE And supported student percentage FTE if 10+ supported students enrolled
  //
  const formData = transformForSubmit(formConfig, newForm);
  console.log(formData);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
