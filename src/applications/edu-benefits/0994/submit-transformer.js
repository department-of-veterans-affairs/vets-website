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
    if (form.data['view:salaryEmploymentTypes']) {
      const { currentSalary, highTechnologyEmploymentType } = form.data[
        'view:salaryEmploymentTypes'
      ];

      const highTechnologyEmploymentTypes = Object.keys(
        highTechnologyEmploymentType,
      )
        .filter(key => highTechnologyEmploymentType[key])
        .map(key => key);

      delete clonedData.highTechnologyEmploymentType;

      return {
        ...clonedData,
        currentSalary,
        highTechnologyEmploymentTypes,
      };
    }
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
