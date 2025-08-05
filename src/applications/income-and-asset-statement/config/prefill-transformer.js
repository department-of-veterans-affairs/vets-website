/* vets-api/config/form_profile_mappings/0969.yml
nonPrefill:
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata, state) {
  const { currentlyLoggedIn } = state.user.login;
  const { veteranSocialSecurityNumber = '', veteranVaFileNumber = '' } =
    formData?.nonPrefill || {};

  return {
    pages,
    formData: {
      isLoggedIn: currentlyLoggedIn, // Set for access in submit.js to re-map veteran information data
      veteranSocialSecurityNumber,
      veteranSsnLastFour: veteranSocialSecurityNumber.slice(-4),
      vaFileNumber: veteranVaFileNumber,
      vaFileNumberLastFour: veteranVaFileNumber.slice(-4),
    },
    metadata,
  };
}
