import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from 'platform/utilities/environment';
import { isActiveDuty } from './containers/PreSubmitInfo';

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

  const fryScholarshipTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    if (clonedData.benefit === 'fryScholarship') {
      clonedData.benefit = 'chapter33FryScholarship';
    }
    if (clonedData.benefit === 'chapter33') {
      clonedData.benefit = 'chapter33Post911';
    }
    if (clonedData.benefitUpdate === 'fryScholarship') {
      clonedData.benefitUpdate = 'chapter33FryScholarship';
    }
    if (clonedData.benefitUpdate === 'chapter33') {
      clonedData.benefitUpdate = 'chapter33Post911';
    }
    return clonedData;
  };

  const tempActiveDuty = formData => {
    if (!environment.isProduction()) {
      try {
        const clonedData = _.cloneDeep(formData);
        clonedData.isActiveDuty = isActiveDuty(formData);
        return clonedData;
      } catch (e) {
        return formData;
      }
    }
    return formData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const contactInfoTransform = formData => ({
    ...formData,
    email: _.get(formData, 'view:otherContactInfo.email', undefined),
    homePhone: _.get(formData, 'view:otherContactInfo.homePhone', undefined),
  });

  const transformedData = [
    newSchoolTransform,
    tempActiveDuty, // Temp Solution for isActiveDuy
    fryScholarshipTransform,
    contactInfoTransform,
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
