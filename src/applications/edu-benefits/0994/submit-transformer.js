import _ from '../../../platform/utilities/data';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  const usFormTransform = () =>
    JSON.parse(transformForSubmit(formConfig, form));

  const addPhoneAndEmail = formData => {
    const clonedData = _.cloneDeep(formData);
    if (form.data['view:phoneAndEmail']) {
      const { dayTimePhone, nightTimePhone, emailAddress } = form.data[
        'view:phoneAndEmail'
      ];

      return {
        ...clonedData,
        dayTimePhone,
        nightTimePhone,
        emailAddress,
      };
    }
    return clonedData;
  };

  const transformHighTechnologyEmploymentType = formData => {
    const clonedData = _.cloneDeep(formData);

    return clonedData;
  };

  const tranformedData = [
    usFormTransform,
    addPhoneAndEmail,
    transformHighTechnologyEmploymentType,
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(tranformedData),
    },
  });
}
