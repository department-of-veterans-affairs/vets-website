import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const contactTransform = formData => {
    const clonedData = cloneDeep(formData);

    if (clonedData.authorizedOfficial['view:isPOC']) {
      // Principles of Excellence PoC is the same as the authorizing official
      const principlesOfExcellencePointOfContact = cloneDeep(
        clonedData.authorizedOfficial,
      );

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        principlesOfExcellencePointOfContact,
      };
    }

    if (clonedData.authorizedOfficial['view:isSCO']) {
      // School certifying official (SCO) is the same as the authorizing official
      const schoolCertifyingOfficial = cloneDeep(clonedData.authorizedOfficial);

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial,
      };
    } else if (
      clonedData.newCommitment?.principlesOfExcellencePointOfContact?.[
        'view:isSCO'
      ]
    ) {
      // School certifying official (SCO) is the same as the Principles of Excellence point of contact
      const schoolCertifyingOfficial = cloneDeep(
        clonedData.newCommitment.principlesOfExcellencePointOfContact,
      );

      clonedData.newCommitment = {
        ...clonedData.newCommitment,
        schoolCertifyingOfficial,
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
