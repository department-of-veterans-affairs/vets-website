const createFakeFooterStore = (
  clinic = { name: '', phone: '' },
  facility = { name: '', phone: '' },
) => {
  return {
    getState: () => ({
      questionnaireData: {
        context: {
          location: {
            ...clinic,
            telecom: [{ system: 'phone', value: clinic.phone }],
          },
          organization: {
            ...facility,
            telecom: [{ system: 'phone', value: facility.phone }],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => ({}),
  };
};

export { createFakeFooterStore };
