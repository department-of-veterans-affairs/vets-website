/* vets-api/config/form_profile_mappings/0969.yml
nonPrefill:
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata) {
  const { veteranSocialSecurityNumber = '', veteranVaFileNumber = '' } =
    formData?.nonPrefill || {};

  return {
    pages,
    formData: {
      veteranSocialSecurityNumber,
      veteranSsnLastFour: veteranSocialSecurityNumber.slice(-4),
      vaFileNumber: veteranVaFileNumber,
      vaFileNumberLastFour: veteranVaFileNumber.slice(-4),
    },
    metadata,
  };
}
