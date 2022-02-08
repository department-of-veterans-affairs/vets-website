export const customCOEsubmit = (formConfig, form) => {
  const payload = { ...form.data };
  return {
    lgyCoeClaim: {
      form: payload,
    },
  };
};
