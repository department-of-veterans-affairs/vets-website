import _ from '../../../platform/utilities/data';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';

export function transform(formConfig, form) {
  const usFormTransform = () =>
    JSON.parse(transformForSubmit(formConfig, form));

  const removePrefillBankAccount = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData.bankAccountType;
    delete clonedData.bankAccountNumber;
    delete clonedData.bankRoutingNumber;
    delete clonedData.bankName;
    return clonedData;
  };

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

  const transformProgramSelection = formData => {
    if (formData.vetTecPrograms) {
      const clonedData = _.cloneDeep(formData);
      const vetTecPrograms = clonedData.vetTecPrograms.map(program => {
        let location = undefined;

        if (program.locationCity && program.locationState) {
          location = {
            city: program.locationCity,
            state: program.locationState,
          };
        }

        return {
          providerName: program.providerName,
          programName: program.programName,
          courseType: program.courseType,
          plannedStartDate: program.plannedStartDate,
          location,
        };
      });

      return {
        ...clonedData,
        vetTecPrograms,
      };
    }
    return formData;
  };
  const tranformedData = [
    usFormTransform,
    removePrefillBankAccount,
    addPhoneAndEmail,
    transformHighTechnologyEmploymentType,
    transformProgramSelection,
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(tranformedData),
    },
  });
}
