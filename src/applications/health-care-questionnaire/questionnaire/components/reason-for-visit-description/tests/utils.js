const createFakeReasonForVisitDescriptionStore = reason => {
  return {
    subscribe: () => {},
    dispatch: () => ({}),
    getState: () => ({
      questionnaireData: {
        context: {
          appointment: {
            comment: reason,
          },
        },
      },
    }),
  };
};

export { createFakeReasonForVisitDescriptionStore };
