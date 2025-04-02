import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { applicantInformationTransform } from '../utils/helpers';

export function transform(formConfig, form) {
  const benefitsTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    const benefits = clonedData['view:benefit'];

    if (benefits.chapter33 || benefits.fryScholarship) {
      clonedData.benefit = 'chapter33';
    } else {
      clonedData.benefit = Object.keys(benefits)
        .find(key => benefits[key])
        .toString();
    }

    delete clonedData['view:benefit'];

    return clonedData;
  };

  const entitlementTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData['view:remainingEntitlement'];
    return clonedData;
  };

  // This needs to be last function call in array below
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const contactInfoTransform = formData => ({
    ...formData,
    mail: formData?.['view:otherContactInfo']?.mail,
    email: formData?.['view:otherContactInfo']?.email,
    homePhone: formData?.['view:otherContactInfo']?.homePhone,
    mobilePhone: formData?.['view:otherContactInfo']?.mobilePhone,
  });

  const transformedData = [
    applicantInformationTransform,
    benefitsTransform,
    entitlementTransform,
    contactInfoTransform,
    usFormTransform, // This needs to be last function call in array
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
