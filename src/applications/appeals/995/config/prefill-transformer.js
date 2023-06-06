/* See vets-api/config/form_profile_mappings/20-0995.yml */

export default function prefillTransformer(pages, formData, metadata) {
  const { veteranSsnLastFour = '', veteranVaFileNumberLastFour = '' } =
    formData || {};

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
