import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { determineEligibilityFor10203Stem } from './helpers';

export function transform(formConfig, form) {
  const fryScholarshipTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    if (clonedData.benefit === 'fryScholarship') {
      clonedData.benefit = 'chapter33';
    }
    const submit10203 = determineEligibilityFor10203Stem(clonedData);
    if (submit10203 !== undefined && !submit10203) {
      clonedData.isEdithNourseRogersScholarship = false;
    }
    return clonedData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const contactInfoTransform = formData => ({
    ...formData,
    email: formData?.['view:otherContactInfo']?.email,
    homePhone: formData?.['view:otherContactInfo']?.homePhone,
    mobilePhone: formData?.['view:otherContactInfo']?.mobilePhone,
  });

  const transformedData = [
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
