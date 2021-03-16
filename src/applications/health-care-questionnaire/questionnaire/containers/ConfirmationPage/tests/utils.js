const createFakeConfirmationStore = ({ hasData }) => {
  return {
    getState: () => {
      return hasData
        ? {
            form: {
              submission: {
                response: {
                  veteranInfo: { fullName: 'Mickey Mouse' },
                  timestamp: new Date(),
                },
              },
            },
            questionnaireData: {
              context: {
                appointment: {
                  attributes: {
                    vdsAppointments: [
                      {
                        clinic: {
                          stopCode: '323',
                          facility: { displayName: 'Magic Kingdom' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          }
        : { form: {}, questionnaireData: {} };
    },
    subscribe: () => {},
    dispatch: () => {},
  };
};

export { createFakeConfirmationStore };
