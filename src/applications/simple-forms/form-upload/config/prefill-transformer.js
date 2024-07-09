export default function prefillTransformer(pages, formData, metadata, state) {
  return {
    pages,
    formData: {
      ...formData,
      'view:veteranPrefillStore': {
        fullName:
          formData?.veteran?.fullName || state.user.profile.userFullName,
        loa: state.user.profile.loa.current,
        ssn: formData?.veteran?.ssn || state.user.profile.ssn,
        zip: formData?.veteran?.address?.postalCode || state.user.profile.zip,
      },
    },
    metadata,
    state,
  };
}
