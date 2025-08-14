import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

// create test object
export function transform(formConfig, form) {
  // console.log({ formConfig, form });

  const contactInfoTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    let { homePhone, mobilePhone } = clonedData.contactInfo;

    // Transfrom form data in state to match schema
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

  const eligibilityTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
    };
  };

  // is this function required? -- see transform in form 10203
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    contactInfoTransform,
    eligibilityTransform,
    usFormTransform,
  ].reduce((formData, transformer) => {
    // console.log('PRETRANSFORM 🥌', formData.data);
    return transformer(formData);
  }, form.data);

  // console.log({ transformedData });

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
