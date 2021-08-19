import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import _ from 'lodash';

export function transform(formConfig, form) {
  const directDepositTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData['view:directDeposit'].declineDirectDeposit;

    return clonedData;
  };

  const reviewPageTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData.AGREED;

    return clonedData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    directDepositTransform,
    reviewPageTransform,
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
