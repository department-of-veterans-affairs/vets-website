export default [
  // 0 -> 1, move user back to address page if country code is bad
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
];
