import { isValidCentralMailPostalCode } from '../../platform/forms/address/validations';

export default [
  // 0 > 1, move user back to address page if zip code is bad
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (
      formData.claimantAddress &&
      !isValidCentralMailPostalCode(formData.claimantAddress)
    ) {
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/claimant-contact-information',
      });
    }

    return { formData, metadata: newMetadata };
  },
  // 1 > 2, move user back to file number if incorrect
  ({ formData, metadata }) => {
    const fileNumbeRegex = /^\d{8,9}$/;
    let newMetadata = metadata;

    if (formData.vaFileNumber && !fileNumbeRegex.test(formData.vaFileNumber)) {
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/veteran-information',
      });
    }

    return { formData, metadata: newMetadata };
  },
];
