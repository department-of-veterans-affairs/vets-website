import _ from 'lodash';

export function transform(_formConfig, form) {
  const signatureTransform = formData => {
    const clonedData = _.cloneDeep(formData);
    delete clonedData.AGREED;
    delete clonedData.signature;

    return clonedData;
  };

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
