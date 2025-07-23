/* vets-api/config/form_profile_mappings/0969.yml
nonPrefill:
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata, state) {
  const { currentlyLoggedIn } = state.user.login;
  const { veteranSocialSecurityNumber = '', veteranVaFileNumber = '' } =
    formData?.nonPrefill || {};
  const email = formData?.email || '';
  const claimantPhone = formData?.phone || '';

  return {
    pages,
    formData: {
      email,
      claimantPhone,
      isLoggedIn: currentlyLoggedIn, // Set for access in submit.js to re-map veteran information data
      veteranSocialSecurityNumber,
      veteranSsnLastFour: veteranSocialSecurityNumber.slice(-4),
      vaFileNumber: veteranVaFileNumber,
      vaFileNumberLastFour: veteranVaFileNumber.slice(-4),
    },
    metadata,
  };
}
