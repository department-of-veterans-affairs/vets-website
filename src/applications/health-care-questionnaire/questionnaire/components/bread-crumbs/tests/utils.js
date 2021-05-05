const createBreadCrumbStore = location => {
  return {
    getState: () => ({
      questionnaireData: {
        context: {
          appointment: {},
          location,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => ({
      toggleLoginModal: () => {},
    }),
  };
};

export { createBreadCrumbStore };
