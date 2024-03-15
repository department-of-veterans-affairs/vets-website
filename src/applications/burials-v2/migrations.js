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
  // NOTICE: All versions above are for previous FORM_21P_530, below is for "V2" of FORM_21P_530
  //         These start with internal form version "3". Since the forms still use the same formId,
  //         the internal mapping for InProgressForm and thus migrations are the same still
  // 2 > 3, Initial V2 migration
  ({ formData, metadata }) => {
    let newFormData = { ...formData };
    const newMetadata = metadata;
    if (formData.relationship.type === 'other') {
      newFormData = {
        ...newFormData,
        relationship: { ...newFormData.relationship, type: null },
      };
    }

    if (formData.locationOfDeath.location === 'other') {
      newFormData = {
        ...newFormData,
        locationOfDeath: { ...newFormData.locationOfDeath, location: null },
      };
    }

    // ['ssn', 'claimantSocialSecurityNumber'],
    // ['date', 'claimantDateOfBirth'],
    // ['files', 'militarySeparationDocuments'],

    return { newFormData, newMetadata };
  },
];
