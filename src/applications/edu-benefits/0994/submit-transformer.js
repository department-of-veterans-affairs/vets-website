import _ from 'lodash/fp';
import { transformForSubmit as usFormsTransformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transformForSubmit(formConfig, form) {
  // Clone the form in so we don’t modify the original...because of reasons FP
  const newForm = _.cloneDeep(form);

  const formData = usFormsTransformForSubmit(formConfig, newForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}
