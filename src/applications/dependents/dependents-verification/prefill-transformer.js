export default function prefillTransformer(pages, formData, metadata) {
  const { ssnLastFour = '', ssn = '', vaFileNumber = '' } =
    formData?.veteranInformation || {};

  return {
    pages,
    formData: {
      veteranInformation: {
        ...formData?.veteranInformation,
        ssnLastFour,
        ssn,
        vaFileNumber,
      },
    },
    metadata,
  };
}
