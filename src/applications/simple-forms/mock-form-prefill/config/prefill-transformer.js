export const prefillTransformer = (pages, formData, metadata) => {
  const { ssn, vaFileNumber } = formData?.data?.attributes?.veteran || {};
  return {
    metadata,
    formData: {
      ssn,
      vaFileNumber,
    },
    pages,
  };
};
