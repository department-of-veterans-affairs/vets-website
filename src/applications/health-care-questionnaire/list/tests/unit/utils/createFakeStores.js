const createFakeListStore = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: [
              {
                appointment: {
                  id: '195bc02c0518870fc6b1e302cfc326b1',
                  facilityName: 'Some Facility Name',
                  appointmentTime: '2021-02-18T15:00:00Z',
                  clinic: {
                    stopCode: '323',
                  },
                },
                questionnaireResponse: {
                  completed: true,
                  submittedOn: '2021-02-18T15:00:00Z',
                },
              },
            ],
            toDo: [
              {
                appointment: {
                  id: '195bc02c0518870fc6b1e302cfc326b0',
                  facilityName: 'Some Facility Name',
                  appointmentTime: '2021-02-23T15:00:00Z',
                  clinic: {
                    stopCode: '323',
                  },
                },
                questionnaireResponse: {
                  completed: false,
                },
              },
            ],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeListStoreEmptyList = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: [],
            toDo: [],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeListStoreForServiceDown = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: undefined,
            toDo: undefined,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

export {
  createFakeListStore,
  createFakeListStoreForServiceDown,
  createFakeListStoreEmptyList,
};
