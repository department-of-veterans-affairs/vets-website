import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { dateSigned } from '../helpers';

export function transform(formConfig, form) {
  const contactInfoTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
      contactInfo: {
        ...clonedData.contactInfo,
        mobilePhone: clonedData.contactInfo.mobilePhone
          ? clonedData.contactInfo.mobilePhone
          : '1231231234',
        // homePhone,
      },
    };
  };

  // Will be removed
  const eligibilityTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.dutyRequirement;
    delete clonedData.otherThanDishonorableDischarge;

    // if (!clonedData.hasCompletedActiveDuty) {
    //   delete clonedData.dateReleasedFromActiveDuty;
    // }

    return {
      ...clonedData,
      dateSigned: dateSigned(),
      dateReleasedFromActiveDuty: clonedData.dateReleasedFromActiveDuty
        ? clonedData.dateReleasedFromActiveDuty
        : '2025-08-20',
      hasCompletedByDischarge: clonedData.dutyRequirement === 'byDischarge',
      hasCompletedActiveDuty: clonedData.dutyRequirement === 'atLeast3Years',
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
    const { trainingProviders } = clonedData;

    delete clonedData.plannedStartDate;

    return {
      ...clonedData,
      trainingProviders: {
        providers: trainingProviders
          ? trainingProviders.map(provider => ({
              ...provider,
            }))
          : [],
        plannedStartDate: clonedData.plannedStartDate || '2025-08-20',
      },
    };
  };

  const employmentDetailsTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
      isEmployed: clonedData.isEmployed ? clonedData.isEmployed : false,
      highestLevelOfEducation: clonedData.highestLevelOfEducation
        ? clonedData.highestLevelOfEducation
        : 'NA',
    };
  };

  const privacyAgreementTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.AGREED;

    return {
      ...clonedData,
      privacyAgreementAccepted: true,
    };
  };

  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    contactInfoTransform,
    eligibilityTransform,
    identificationTransform,
    employmentDetailsTransform,
    privacyAgreementTransform,
    trainingProviderTransform,
    usFormTransform,
  ].reduce((formData, transformer) => {
    return transformer(formData);
  }, form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
