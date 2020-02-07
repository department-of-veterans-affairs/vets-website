import _ from 'platform/utilities/data';

export default function prefillTransformer(pages, formData, metadata) {
  const prefillContactInformation = data => {
    const newData = _.omit(['veteran'], data);
    const { veteran } = data;

    if (veteran) {
      const { emailAddress, primaryPhone, mailingAddress } = veteran;
      newData.phoneAndEmail = {};
      if (emailAddress) {
        newData.phoneAndEmail.emailAddress = emailAddress;
      }
      if (primaryPhone) {
        newData.phoneAndEmail.primaryPhone = primaryPhone;
      }
      if (mailingAddress) {
        newData.mailingAddress = mailingAddress;
      }
    }

    return newData;
  };

  const prefillPersonalInformation = data => {
    const newData = _.omit(['veteran'], data);
    const { veteran } = data;

    if (veteran) {
      const { emailAddress, primaryPhone, mailingAddress } = veteran;
      newData.phoneAndEmail = {};
      if (emailAddress) {
        newData.phoneAndEmail.emailAddress = emailAddress;
      }
      if (primaryPhone) {
        newData.phoneAndEmail.primaryPhone = primaryPhone;
      }
      if (mailingAddress) {
        newData.mailingAddress = mailingAddress;
      }
    }

    return newData;
  };

  const transformations = [
    prefillContactInformation,
    prefillPersonalInformation,
  ];

  const applyTransformations = (data = {}, transformer) => transformer(data);

  return {
    metadata,
    formData: transformations.reduce(applyTransformations, formData),
    pages,
  };
}
