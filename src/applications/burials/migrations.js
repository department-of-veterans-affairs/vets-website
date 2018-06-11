import { isValidCentralMailPostalCode } from '../../platform/forms/address/validations';

export default [
  // 0 > 1, move user back to address page if zip code is bad
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (formData.claimantAddress && !isValidCentralMailPostalCode(formData.claimantAddress)) {
      newMetadata = Object.assign({}, metadata, {
        returnUrl: '/claimant-contact-information'
      });
    }

    return { formData, metadata: newMetadata };
  }
];
