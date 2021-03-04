const createFakeFooterStore = (clinic = {}, clinicFriendlyName = '') => {
  return {
    getState: () => ({
      questionnaireData: {
        context: {
          appointment: {
            attributes: {
              clinicFriendlyName,
              vdsAppointments: [{ clinic }],
            },
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => ({}),
  };
};

export { createFakeFooterStore };
