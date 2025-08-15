import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

// create test object
export function transform(formConfig, form) {
  // console.log({ formConfig, form });

  const contactInfoTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    let { homePhone, mobilePhone } = clonedData.contactInfo;

    homePhone = homePhone?.replace(/[^0-9]/g, '');
    mobilePhone = mobilePhone?.replace(/[^0-9]/g, '');

    return {
      ...clonedData,
      contactInfo: {
        ...clonedData.contactInfo,
        homePhone,
        mobilePhone,
      },
    };
  };

  /*
  - There is a naming mismatch between hasCompletedActiveDuty and activeDutyDuringHitechVets.
  - dutyRequirement corresponds to hasCompletedActiveDuty on the schema.
  - hasCompletedActiveDuty corresponds to activeDutyDuringHitechVets on the schema.
  - activeDutyDuringHitechVets is not a value in formData.
  - verify this is correct
  */

  const eligibilityTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { dutyRequirement } = clonedData;

    return {
      ...clonedData,
      hasCompletedByDischarge: dutyRequirement === 'byDischarge',
      hasCompletedActiveDuty: dutyRequirement === 'atLeast3Years',
    };
  };

  const identificationTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { hasCompletedActiveDuty } = clonedData;

    return {
      ...clonedData,
      activeDutyDuringHitechVets: hasCompletedActiveDuty,
    };
  };

  const trainingProviderTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { plannedStartDate, trainingProviders } = clonedData;

    return {
      ...clonedData,
      trainingProviders: trainingProviders.map(provider => ({
        ...provider,
        plannedStartDate,
      })),
    };
  };

  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    contactInfoTransform,
    eligibilityTransform,
    identificationTransform,
    trainingProviderTransform,
    usFormTransform,
  ].reduce((formData, transformer) => {
    // console.log('PRETRANSFORM 🥌', formData);
    return transformer(formData);
  }, form.data);

  // console.log({ transformedData });

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
