import formConfig from '../../../config/form';

export const mockFormData = {
  disabilityRating: "I haven't applied for a disability rating",
  'view:disabilityEligibility': {},
  characterOfDischarge: 'honorable',
  characterOfDischargeTWO: {},
  separation: 'OVER_3YRS',
  militaryServiceCurrentlyServing: false,
  militaryServiceCompleted: false,
  militaryServiceTotalTimeServed: 'More than 20 years',
  goals: {
    understandMyBenefits: true,
  },
  privacyAgreementAccepted: true,
};

export const getData = ({
  loggedIn = true,
  isVerified = true,
  data = mockFormData,
  contestableIssues = {},
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
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
          userFullName: {
            first: 'Test',
            middle: 'B',
            last: 'Test',
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
