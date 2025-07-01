/* vets-api/config/form_profile_mappings/0969.yml
nonPrefill:
  veteranSsnLastFour:
  veteranVaFileNumberLastFour:
*/

export default function prefillTransformer(pages, formData, metadata) {
  const { veteranSsnLastFour = '', veteranVaFileNumberLastFour = '' } =
    formData?.nonPrefill || {};

  return {
    pages,
    formData: {
      veteranSocialSecurityNumber: veteranSsnLastFour,
      vaFileNumber: veteranVaFileNumberLastFour,
    },
    metadata,
  };
}
