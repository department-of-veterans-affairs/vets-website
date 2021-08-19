/* vets-api/config/form_profile_mappings/10182.yml
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
      veteran: {
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
      },
    },
    metadata,
  };
}
