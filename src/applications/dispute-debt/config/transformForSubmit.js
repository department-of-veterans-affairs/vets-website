const transformForSubmit = (formConfig, form) => {
  const { data } = form;

  return {
    ...data,
    veteranInformation: {
      ...data.veteran,
    },
  };
};

export default transformForSubmit;
