import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  // console.log({ formConfig, form });
  const eligibilityTransform = formData => {
    // Transfrom form data in state to match schema

    return _.cloneDeep(formData);
  };

  //  is this function required?
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [eligibilityTransform, usFormTransform].reduce(
    (formData, transformer) => transformer(formData),
    form.data,
  );

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
