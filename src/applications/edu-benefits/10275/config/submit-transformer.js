import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const contactTransform = formData => {
    const clonedData = cloneDeep(formData);
    const authorizingOfficial = cloneDeep(clonedData.authorizingOfficial);

    if (clonedData.authorizingOfficial['view:isPOC']) {
      // Principles of Excellence PoC is the same as the authorizing official
      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        principlesOfExcellencePointOfContact: authorizingOfficial,
      };
    }

    if (clonedData.authorizingOfficial['view:isSCO']) {
      // School certifying official (SCO) is the same as the authorizing official
      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial: authorizingOfficial,
      };
    }

    return clonedData;
  };

  // Stringifies the form data and removes empty fields
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    contactTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
