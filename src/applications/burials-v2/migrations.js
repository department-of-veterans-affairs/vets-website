import { isValidCentralMailPostalCode } from 'platform/forms/address/validations';

export default [
  // 0 > 1, move user back to address page if zip code is bad
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (
      formData.claimantAddress &&
      !isValidCentralMailPostalCode(formData.claimantAddress)
    ) {
      newMetadata = { ...metadata, returnUrl: '/claimant-contact-information' };
    }

    return { formData, metadata: newMetadata };
  },
  // 1 > 2, move user back to file number if incorrect
  ({ formData, metadata }) => {
    const fileNumbeRegex = /^\d{8,9}$/;
    let newMetadata = metadata;

    if (formData.vaFileNumber && !fileNumbeRegex.test(formData.vaFileNumber)) {
      newMetadata = { ...metadata, returnUrl: '/veteran-information' };
    }

    return { formData, metadata: newMetadata };
  },
  // Prevent test failure when migrations don't match version number
  // (see src/platform/forms/tests/form.unit.spec.js validMigrations)
  ({ formData, metadata }) => {
    return { formData, metadata };
  },
];
