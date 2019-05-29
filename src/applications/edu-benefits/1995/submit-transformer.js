import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  const newSchoolTransform = formData => {
    let clonedData = _.cloneDeep(formData);

    delete clonedData.newSchoolName;
    delete clonedData.newSchoolAddress;

    clonedData = {
      ...clonedData,
      newSchool: {
        ...clonedData.newSchool,
        name: formData.newSchoolName,
        address: formData.newSchoolAddress,
      },
    };

    return clonedData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    newSchoolTransform,
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
