export const prefillTransformer = (pages, formData, metadata) => {
  const { ssn, vaFileNumber, firstName, middleName, lastName, suffix } =
    formData?.data?.attributes?.veteran || {};

  return {
    metadata,
    formData: {
      ssn,
      vaFileNumber,
      fullName: {
        first: firstName,
        middle: middleName,
        last: lastName,
        suffix,
      },
    },
    pages,
  };
};
