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
