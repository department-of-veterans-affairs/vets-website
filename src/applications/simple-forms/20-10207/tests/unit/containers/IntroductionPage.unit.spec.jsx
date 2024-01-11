import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: ['20-10207'],
        dob: '2000-01-01',
        loa: {
          current: 3,
        },
        verified: true,
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
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
};

describe('IntroductionPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should render <LOA3 content when userLoggedIn is true and userIdVerified is false', () => {
    const userNotVerifiedMockStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            ...mockStore.getState().user.profile,
            loa: {
              current: 1,
            },
            verified: false,
          },
        },
      }),
    };
    const { container } = render(
      <Provider store={userNotVerifiedMockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const userNotVerifiedDiv = container.querySelector(
      '[data-testid=verifyIdAlert]',
    );
    expect(userNotVerifiedDiv).to.exist;
  });
});
