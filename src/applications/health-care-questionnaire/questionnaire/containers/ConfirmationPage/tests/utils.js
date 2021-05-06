const createFakeConfirmationStore = ({ hasData }) => {
  return {
    getState: () => {
      return hasData
        ? {
            form: {
              submission: {
                response: [
                  {
                    id: 'questionnaire-response-test-id',
                  },
                ],
              },
            },
            questionnaireData: {
              context: {
                location: {
                  type: [
                    {
                      coding: [
                        {
                          display: 'Primary Care',
                        },
                      ],
                      text: 'Primary Care',
                    },
                  ],
                },
                organization: {
                  name: 'Magic Kingdom',
                },
                appointment: {},
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
