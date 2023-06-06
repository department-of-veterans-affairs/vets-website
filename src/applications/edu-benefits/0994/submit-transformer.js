import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  const usFormTransform = () =>
    JSON.parse(transformForSubmit(formConfig, form));

  const prefillTransforms = formData => {
    let clonedData = _.cloneDeep(formData);

    delete clonedData.bankAccountType;
    delete clonedData.bankAccountNumber;
    delete clonedData.bankRoutingNumber;
    delete clonedData.bankName;

    const prefillBankAccount = _.get(clonedData, 'prefillBankAccount', {});
    const { bankAccountType } = prefillBankAccount;
    if (bankAccountType && bankAccountType.length > 0) {
      clonedData = {
        ...clonedData,
        prefillBankAccount: {
          ...prefillBankAccount,
          bankAccountType: bankAccountType.toLowerCase(),
        },
      };
    }

    return clonedData;
  };

  const addPhoneAndEmail = formData => {
    if (form.data['view:phoneAndEmail']) {
      const clonedData = _.cloneDeep(formData);
      const { homePhone, mobilePhone, emailAddress } = form.data[
        'view:phoneAndEmail'
      ];

      return {
        ...clonedData,
        homePhone,
        mobilePhone,
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
        let location;

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
    prefillTransforms,
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
