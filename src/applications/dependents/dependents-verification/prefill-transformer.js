/**
 * Prefill transformer for Dependents Verification form
 * @param {object} pages - processed pages from form config
 * @param {object} formData - current form data (after any migrations)
 * @param {object} metadata - in progress metadata
 * @returns {object} - transformed pages, formData, and metadata
 */
export default function prefillTransformer(pages, formData, metadata) {
  const { ssnLastFour = '' } = formData?.veteranInformation || {};

  return {
    pages,
    formData: {
      veteranInformation: {
        ...formData?.veteranInformation,
        ssnLastFour,
      },
    },
    metadata,
  };
}
