import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

// create test object
export function transform(formConfig, form) {
  const contactInfoTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { contactInfo } = clonedData;

    const homePhone = contactInfo?.homePhone
      ? contactInfo.homePhone.replace(/[^0-9]/g, '')
      : '';

    const mobilePhone = contactInfo?.mobilePhone
      ? contactInfo.mobilePhone.replace(/[^0-9]/g, '')
      : '';

    return {
      ...clonedData,
      contactInfo: {
        ...clonedData.contactInfo,
        homePhone,
        mobilePhone,
      },
    };
  };

  // Will be removed
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

  /* 
  trainingProviders.providers gets stripped if no providers are added -- 
  values with empty arrays passed to transformForSubmit are removed.

  Consider making both fields in trainingProviders optional in schema, or using oneOf 
  property for trainingProviders.providers to be an array or boolean for explicit definition.

  Verify plannedStartDate transform after schema update
  */

  const trainingProviderTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const { plannedStartDate, trainingProviders } = clonedData;

    delete clonedData.plannedStartDate;

    return {
      ...clonedData,
      trainingProviders: {
        providers: trainingProviders
          ? trainingProviders.map(provider => ({
              ...provider,
            }))
          : [],
        plannedStartDate: plannedStartDate || null,
      },
    };
  };

  /*
  consider employmentDetails transfom or updating schema:
  - employmentStatus is optional in in UI config but required in schema
  - highestLevelOfEducation is optional in UI config but required in schema
  - want to capture user input in schema if select 'something else' for highestLevelOfEducation?
  - want to capture user input in schema if select 'something else' for technologyAreaOfFocus?
  */

  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    contactInfoTransform,
    eligibilityTransform,
    identificationTransform,
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
