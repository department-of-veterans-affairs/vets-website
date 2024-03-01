import configureStore from 'redux-mock-store';

const scheduledDowntimeState = {
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: {
      get() {},
    },
    dismissedDowntimeWarnings: [],
  },
};

const createStore = ({
  app = '',
  demographicsUpToDate = 'yes',
  emergencyContactUpToDate = 'yes',
  nextOfKinUpToDate = 'yes',
  travelQuestion = null,
  travelAddress = null,
  travelMileage = null,
  travelVehicle = null,
  travelReview = null,
  appointments = [
    {
      clinicPhone: '555-867-5309',
      startTime: '2021-07-19T13:56:31',
      facilityName: 'Acme VA',
      clinicName: 'Green Team Clinic1',
    },
  ],
  veteranData = {},
  formPages = ['first-page', 'second-page', 'third-page', 'fourth-page'],
  features = {},
  error = null,
  seeStaffMessage = null,
  eligibleToFile = null,
  alreadyFiled = null,
} = {}) => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const initState = {
    checkInData: {
      app,
      context: {
        token: 'some-token',
        eligibleToFile,
        alreadyFiled,
      },
      form: {
        pages: formPages,
        data: {
          demographicsUpToDate,
          emergencyContactUpToDate,
          nextOfKinUpToDate,
          'travel-question': travelQuestion,
          'travel-address': travelAddress,
          'travel-mileage': travelMileage,
          'travel-vehicle': travelVehicle,
          'travel-review': travelReview,
        },
      },
      appointments,
      veteranData,
      error,
      seeStaffMessage,
    },
    featureToggles: features,
    ...scheduledDowntimeState,
  };
  return mockStore(initState);
};

export { scheduledDowntimeState, createStore };
