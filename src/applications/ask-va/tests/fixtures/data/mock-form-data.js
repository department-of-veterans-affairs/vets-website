import formConfig from '../../../config/form';

export const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestableIssues = {},
  loaLevel = 3,
  signInServiceName,
  loading = false,
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/sc-base-url',
    },
    route: {
      formConfig,
      pageList: [
        { path: '/introduction' },
        { path: '/first-page', formConfig },
      ],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          loading,
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
          userFullName: {
            first: 'Peter',
            middle: 'B',
            last: 'Parker',
          },
          loa: {
            current: loaLevel,
          },
          signIn: {
            serviceName: signInServiceName,
          },
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestableIssues,
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

export const userData = {
  userFullName: {
    first: 'Peter',
    middle: 'B',
    last: 'Parker',
  },
  loa: {
    current: 3,
  },
};
