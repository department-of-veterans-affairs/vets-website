import _ from '../../../platform/utilities/data';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  const usFormTransform = () =>
    JSON.parse(transformForSubmit(formConfig, form));

  const addPhoneAndEmail = formData => {
    if (form.data['view:phoneAndEmail']) {
      const clonedData = _.cloneDeep(formData);
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
    return formData;
  };

  const transformHighTechnologyEmploymentType = formData => {
    if (form.data['view:salaryEmploymentTypes']) {
      const clonedData = _.cloneDeep(formData);
      const { currentSalary, highTechnologyEmploymentType } = form.data[
        'view:salaryEmploymentTypes'
      ];

      const highTechnologyEmploymentTypes = Object.keys(
        highTechnologyEmploymentType,
      ).filter(key => highTechnologyEmploymentType[key] && key !== 'noneApply');

      delete clonedData.highTechnologyEmploymentType;

      return {
        ...clonedData,
        currentSalary,
        highTechnologyEmploymentTypes,
      };
    }
    return formData;
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
