/* vets-api/config/form_profile_mappings/DISPUTE-DEBT.yml */

export default function prefillTransformer(pages, formData, metadata) {
  const { fileNumber = '', ssn = '' } = formData?.veteranInformation || {};

  return {
    pages,
    formData: {
      veteranInformation: {
        ssnLastFour: ssn,
        vaFileLastFour: fileNumber,
      },
    },
    metadata,
  };
}
