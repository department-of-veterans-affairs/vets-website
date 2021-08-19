const createFakeReasonForVisitStore = ({ reason = '' }) => {
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

export { createFakeReasonForVisitStore };
