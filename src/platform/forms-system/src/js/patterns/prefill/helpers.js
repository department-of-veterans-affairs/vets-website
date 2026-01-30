export const transformEmailForSubmit = form => {
  let transformedForm = form;
  if (form.data?.veteran?.email) {
    transformedForm = {
      ...form,
      data: {
        ...form.data,
        veteran: {
          ...form.data.veteran,
          email: form.data.veteran.email?.emailAddress,
        },
      },
    };
  }
  return transformedForm;
};
