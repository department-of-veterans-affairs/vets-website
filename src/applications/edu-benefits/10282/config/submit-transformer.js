import _ from 'lodash';
import { getTransformIntlPhoneNumber } from '../helpers';

export function transform(formConfig, form) {
  const signatureTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData.AGREED;
    delete clonedData.signature;

    return clonedData;
  };

  const contactInfoTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    let { homePhone, mobilePhone } = clonedData.contactInfo;

    homePhone = getTransformIntlPhoneNumber(homePhone);
    mobilePhone = getTransformIntlPhoneNumber(mobilePhone);

    if (homePhone && mobilePhone) {
      return {
        ...clonedData,
        contactInfo: {
          ...clonedData.contactInfo,
          homePhone,
          mobilePhone,
        },
      };
    }
    if (homePhone) {
      delete clonedData.contactInfo.mobilePhone;
      return {
        ...clonedData,
        contactInfo: {
          ...clonedData.contactInfo,
          homePhone,
        },
      };
    }
    if (mobilePhone) {
      delete clonedData.contactInfo.homePhone;
      return {
        ...clonedData,
        contactInfo: {
          ...clonedData.contactInfo,
          mobilePhone,
        },
      };
    }

    delete clonedData.contactInfo.homePhone;
    delete clonedData.contactInfo.mobilePhone;

    return {
      ...clonedData,
    };
  };

  const transformedData = [signatureTransform, contactInfoTransform].reduce(
    (formData, transformer) => transformer(formData),
    form.data,
  );

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(transformedData),
    },
  });
}
