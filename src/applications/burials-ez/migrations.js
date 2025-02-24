export default [
  // 0 -> 1, move user back to address page if country code is bad
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/95950
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (formData?.claimantAddress?.country?.length !== 3) {
      newMetadata = {
        ...metadata,
        returnUrl: '/claimant-information/mailing-address',
      };
    }

    return { formData, metadata: newMetadata };
  },
  // 1 > 2, move user without an email back to the contact information page
  ({ formData = {}, metadata = {} }) => {
    const newMetadata = { ...metadata };

    if (!formData.claimantEmail) {
      newMetadata.returnUrl = '/claimant-information/contact-information';
    }

    return { formData, metadata: newMetadata };
  },
  // 2 > 3, use new location of death format
  ({ formData = {}, metadata = {} }) => {
    const { locationOfDeath } = formData;
    if (
      !locationOfDeath ||
      locationOfDeath.location === 'other' ||
      locationOfDeath.location === 'atHome'
    ) {
      return { formData, metadata };
    }

    const newFormData = formData;
    const { location } = locationOfDeath;
    newFormData[location] = locationOfDeath[location];
    newFormData.locationOfDeath[location] = {};

    return { formData: newFormData, metadata };
  },
];
