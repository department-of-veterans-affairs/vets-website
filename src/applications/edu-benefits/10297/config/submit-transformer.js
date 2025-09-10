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

    const finalData = {
      ...clonedData,
      dateSigned: dateSigned(),
      dateReleasedFromActiveDuty: clonedData.dateReleasedFromActiveDuty
        ? clonedData.dateReleasedFromActiveDuty
        : '2025-08-20',
    };

    delete finalData.dutyRequirement;
    delete finalData.otherThanDishonorableDischarge;

    return finalData;
  };

  const identificationTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { activeDutyDuringHitechVets } = clonedData;

    return {
      ...clonedData,
      activeDutyDuringHitechVets,
    };
  };

  const trainingProviderTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const parsedData = JSON.parse(clonedData);

    const { trainingProviders } = parsedData;

    let finalData;

    if (trainingProviders && trainingProviders.length > 0) {
      finalData = {
        ...parsedData,
        trainingProviders: {
          providers: trainingProviders.map(provider => ({
            ...provider,
          })),
          plannedStartDate: parsedData.plannedStartDate || 'XXXX-XX-XX',
        },
      };
    } else {
      finalData = {
        ...parsedData,
        trainingProviders: {
          providers: [],
          plannedStartDate: parsedData.plannedStartDate || 'XXXX-XX-XX',
        },
      };
    }

    delete finalData.plannedStartDate;
    return JSON.stringify(finalData);
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

    delete clonedData.statementOfTruthCertified;
    delete clonedData.AGREED;
    const attestationAgreementAccepted =
      clonedData.privacyAgreementAccepted || false;
    delete clonedData.privacyAgreementAccepted;

    return {
      ...clonedData,
      attestationAgreementAccepted,
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
    usFormTransform,
    trainingProviderTransform,
  ].reduce((formData, transformer) => {
    return transformer(formData);
  }, form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
