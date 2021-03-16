const createFakeListStore = () => {
  return {
    getState: () => ({
      questionnaireListData: {
        list: {
          questionnaires: {
            completed: [
              {
                appointment: {
                  id: '195bc02c0518870fc6b1e302cfc326b62',
                  type: 'va_appointments',
                  attributes: {
                    startDate: '2020-08-26T15:00:00Z',
                    sta6aid: '983',
                    clinicId: '848',
                    clinicFriendlyName: 'CHY PC VAR2',
                    facilityId: '983',
                    communityCare: false,
                    patientIcn: '1013124304V115761',
                    vdsAppointments: [
                      {
                        bookingNotes:
                          'Follow-up/Routine: testing reason for visit field availability',
                        appointmentLength: '20',
                        id: '848;20200826.090000',
                        appointmentTime: '2021-02-28T15:00:00Z',
                        clinic: {
                          name: 'CHY PC VAR2',
                          askForCheckIn: false,
                          facilityCode: '983',
                          facility: {
                            displayName:
                              'VDS Facility Primary Care Display Name',
                          },
                          stopCode: '502',
                        },
                        type: 'REGULAR',
                        currentStatus: 'FUTURE',
                      },
                    ],
                    vvsAppointments: [],
                  },
                },
                questionnaire: [
                  {
                    id: 'questionnnaire-ABC-123',
                    questionnaireResponse: {
                      id: 'response-123',
                      status: 'completed',
                      submittedOn: '2021-01-18T15:00:00Z',
                    },
                  },
                ],
              },
            ],
            toDo: [
              {
                appointment: {
                  id: '195bc02c0518870fc6b1e302cfc326b59',
                  type: 'va_appointments',
                  attributes: {
                    startDate: '2020-08-26T15:00:00Z',
                    sta6aid: '983',
                    clinicId: '848',
                    clinicFriendlyName: 'CHY PC VAR2',
                    facilityId: '983',
                    communityCare: false,
                    patientIcn: '1013124304V115761',
                    vdsAppointments: [
                      {
                        bookingNotes:
                          'Follow-up/Routine: testing reason for visit field availability',
                        appointmentLength: '20',
                        id: '848;20200826.090000',
                        appointmentTime: '2021-03-26T15:00:00Z',
                        clinic: {
                          name: 'CHY PC VAR2',
                          askForCheckIn: false,
                          facilityCode: '983',
                          facility: {
                            displayName: 'Awesome Facility',
                          },
                          stopCode: '502',
                        },
                        type: 'REGULAR',
                        currentStatus: 'FUTURE',
                      },
                    ],
                    vvsAppointments: [],
                  },
                },
                questionnaire: [
                  {
                    id: 'questionnnaire-ABC-123',
                    questionnaireResponse: {},
                  },
                ],
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
